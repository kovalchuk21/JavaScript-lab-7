export class ApiRepository {
    #baseUrl;
    #type;

    constructor(baseUrl, type) {
        this.#baseUrl = baseUrl;
        this.#type = type;
    }

    #url(id) {
        const idPart = id !== undefined ? `&id=${encodeURIComponent(id)}` : "";
        return `${this.#baseUrl}?type=${this.#type}${idPart}`;
    }

    async readAll() {
        const response = await fetch(this.#url());
        if (!response.ok) throw new Error(`Помилка завантаження: ${response.status}`);
        return response.json();
    }

    async readById(id) {
        const response = await fetch(this.#url(id));
        if (!response.ok) throw new Error(`Помилка завантаження: ${response.status}`);
        return response.json();
    }

    async create(item) {
        const response = await fetch(this.#url(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
        });
        if (!response.ok) throw new Error(`Помилка створення: ${response.status}`);
        return response.json();
    }

    async update(id, changes) {
        const response = await fetch(this.#url(id), {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changes),
        });
        if (!response.ok) throw new Error(`Помилка оновлення: ${response.status}`);
        return response.json();
    }

    async delete(id) {
        const response = await fetch(this.#url(id), { method: "DELETE" });
        if (!response.ok) throw new Error(`Помилка видалення: ${response.status}`);
        return response.json();
    }
}

const API_BASE_URL = "http://localhost/mock-server/api.php";

export const enterprisesApi = new ApiRepository(API_BASE_URL, "enterprise_kovalchuk");
export const productsApi = new ApiRepository(API_BASE_URL, "product_kovalchuk");
export const suppliesApi = new ApiRepository(API_BASE_URL, "supply_kovalchuk");
