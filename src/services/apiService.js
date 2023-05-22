import { get } from "./httpService";

const CITIES_URL = "http://localhost:3001/cities";
const CANDIDATES_URL = "http://localhost:3001/candidates";
const ELECTION_URL = "http://localhost:3001/election";

export async function apiGetDataCities() {
	const result = await get(CITIES_URL);
	const cities = result.sort((a, b) => a.name.localeCompare(b.name));
	return cities;
}

export async function apiGetDataCandidates() {
	const candidates = await get(CANDIDATES_URL);
	return candidates;
}

export async function apiGetDataElection() {
	const election = await get(ELECTION_URL);
	return election;
}
