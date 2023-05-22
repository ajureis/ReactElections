import { useState, useEffect } from "react";

import {
	apiGetDataCities,
	apiGetDataCandidates,
	apiGetDataElection,
} from "../services/apiService";

import Header from "../components/Header";
import Main from "../components/Main";

import Loading from "../components/Loading";
import Error from "../components/Error";
import Card from "../components/Card";

export default function ElectionsPage() {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [cities, setCities] = useState([]);
	const [candidates, setCandidates] = useState([]);
	const [selectedCity, setSelectedCity] = useState("");
	const [electionData, setElectionData] = useState(null);

	const getAllData = async (apiGetData, setData) => {
		try {
			const data = await apiGetData();
			setData(data);
			setTimeout(() => {
				setLoading(false);
			}, 500);
		} catch (error) {
			setError(error.message);
		}
	};

	useEffect(() => {
		getAllData(apiGetDataCities, setCities);
	}, []);

	useEffect(() => {
		getAllData(apiGetDataCandidates, setCandidates);
	}, []);

	useEffect(() => {
		async function getElectionsData() {
			if (selectedCity) {
				try {
					const electionData = await apiGetDataElection();

					// Encontra a cidade correspondente ao cityId
					const selectedCityObj = cities.find(
						(city) => city.id === selectedCity
					);

					// Filtra os candidatos que pertencem a cidade selecionada
					const filterCandidate = electionData.filter((candidate) => {
						return candidate.cityId === selectedCity;
					});

					// Com os candidatos filtrados, adicionar nome, vots, id e username no objeto
					const candidateData = filterCandidate.map((candidate) => {
						const candidateObj = candidates.find(
							(candidateObj) => candidateObj.id === candidate.candidateId
						);
						return {
							id: candidateObj.id,
							name: candidateObj.name,
							votes: candidate.votes,
							username: candidateObj.username,
						};
					});

					// Calcula o total de votos da eleição
					const totalVotes = candidateData.reduce(
						(total, candidate) => total + candidate.votes,
						0
					);

					// Calcula a porcentagem de votos de cada candidato
					candidateData.forEach((candidate) => {
						const percentage = ((candidate.votes / totalVotes) * 100).toFixed(
							2
						);
						candidate.percentage = percentage;
					});

					// Verifica se a cidade foi encontrada
					if (selectedCityObj) {
						const cityName = selectedCityObj.name;

						// Atualiza os dados da eleição com o nome da cidade vinculado
						const updatedElectionData = {
							cityName: cityName,
							votingPopulation:
								selectedCityObj.votingPopulation.toLocaleString(),
							absence: selectedCityObj.absence.toLocaleString(),
							presence: selectedCityObj.presence.toLocaleString(),
							candidateData: candidateData,
						};

						setElectionData(updatedElectionData);
					}
				} catch (error) {
					setError(error.message);
				}
			} else {
				setElectionData(null);
			}
			setLoading(false);
		}
		getElectionsData();
	}, [selectedCity, cities, candidates]);

	const handleCityChange = (event) => {
		setLoading(true);
		const newSelectedCity = event.target.value;
		setTimeout(() => {
			setSelectedCity(newSelectedCity);
		}, 500);
	};

	let mainJsx = (
		<div className="flex justify-center my-4">
			<Loading />
		</div>
	);

	if (error) {
		mainJsx = <Error>{error}</Error>;
	}

	if (!loading && !error) {
		mainJsx = (
			<>
				{electionData && (
					<section className="border p-4">
						<div className="text-center mb-4">
							<>
								<h1 className="font-semibold text-lg mb-2">
									Eleição em {electionData.cityName}
								</h1>
								<p className="mb-4 gap-3 flex justify-center">
									<span className="font-semibold">Total de eleitores:</span>
									<span>{electionData.votingPopulation}</span>
									<span className="font-semibold">Abstenção: </span>
									<span>{electionData.absence}</span>
									<span className="font-semibold">Comparecimento:</span>
									<span>{electionData.presence}</span>
								</p>
								<p className="font-semibold text-sm mb-5">
									{electionData.candidateData.length} Candidatos
								</p>
								<div className="flex flex-wrap justify-center">
									{electionData.candidateData.map(
										({ id, name, votes, percentage, username }, index) => (
											<Card
												key={id}
												name={name}
												percentage={percentage}
												vote={votes.toLocaleString()}
												elected={index === 0 ? "Eleito" : "Não eleito"}
												isFirstCandidate={index === 0}
												img={`./img/${username}.png`}
											/>
										)
									)}
								</div>
							</>
						</div>
					</section>
				)}
			</>
		);
	}

	return (
		<>
			<Header>react-elections</Header>
			<Main>
				<section className="flex justify-center flex-col items-center mb-8">
					<p className="mb-3">Selecione o município:</p>
					<select
						onChange={handleCityChange}
						className="border border-gray-300 rounded p-1">
						<option value=""></option>
						{cities.map((city) => (
							<option key={city.id} value={city.id}>
								{city.name}
							</option>
						))}
					</select>
				</section>
				{mainJsx}
			</Main>
		</>
	);
}
