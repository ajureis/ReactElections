export default function Card({
	name = "Nome do candidato",
	percentage = "0,00",
	vote = "0",
	elected = "Eleito",
	isFirstCandidate,
	img = "https://via.placeholder.com/234x234",
}) {
	return (
		<div className="shadow p-4 m-2 w-60">
			<div className="flex justify-between mb-3">
				<div className="relative w-16 h-16">
					<img
						src={img}
						alt="Imagem da cidade"
						className="rounded-full border border-gray-100 shadow-sm"
					/>
				</div>
				<div className="text-right">
					<p
						className={`font-semibold ${
							isFirstCandidate ? "text-green-500" : "text-red-500"
						}`}>
						{percentage} %
					</p>
					<p className="text-sm">{vote} votos</p>
				</div>
			</div>
			<div className="text-center">
				<p className="mb-4">{name}</p>
				<p
					className={`font-semibold ${
						isFirstCandidate ? "text-green-500" : "text-red-500"
					}`}>
					{elected}
				</p>
			</div>
		</div>
	);
}
