
export interface State {
  id: number;
  sigla: string;
  nome: string;
}

export interface City {
  id: number;
  nome: string;
}

const IBGE_API_BASE = "https://servicodados.ibge.gov.br/api/v1/localidades";

export const locationService = {
  async fetchStates(): Promise<State[]> {
    try {
      const response = await fetch(`${IBGE_API_BASE}/estados?orderBy=nome`);
      if (!response.ok) {
        throw new Error("Failed to fetch states");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    }
  },

  async fetchCities(uf: string): Promise<City[]> {
    if (!uf) return [];
    try {
      const response = await fetch(`${IBGE_API_BASE}/estados/${uf}/municipios`);
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  },
};
