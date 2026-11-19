import { renderRoute } from "./router.js";
import { enterprisesApi, productsApi, suppliesApi } from "./api.js";

export const state = {
    enterprises: { items: [], status: "idle", error: null, editingId: null, message: "" },
    products:    { items: [], status: "idle", error: null, editingId: null, message: "" },
    supplies:    { items: [], status: "idle", error: null, editingId: null, message: "" },
};

function setError(key, error) {
    state[key].status = "error";
    state[key].error = error.message;
    renderRoute();
}

async function loadEntity(key, api) {
    state[key].status = "loading";
    renderRoute();
    try {
        state[key].items = await api.readAll();
        state[key].status = "success";
        state[key].error = null;
    } catch (error) {
        state[key].status = "error";
        state[key].error = error.message;
    }
    renderRoute();
}

export async function loadEnterprises() {
    await loadEntity("enterprises", enterprisesApi);
}

export async function createEnterprise(data) {
    try {
        const created = await enterprisesApi.create(data);
        state.enterprises.message = `Створено підприємство id ${created.id}.`;
        await loadEnterprises();
    } catch (error) {
        setError("enterprises", error);
    }
}

export async function updateEnterprise(id, data) {
    try {
        await enterprisesApi.update(id, data);
        state.enterprises.editingId = null;
        state.enterprises.message = `Підприємство id ${id} оновлено.`;
        await loadEnterprises();
    } catch (error) {
        setError("enterprises", error);
    }
}

export async function deleteEnterprise(id) {
    try {
        await enterprisesApi.delete(id);
        if (state.enterprises.editingId === id) state.enterprises.editingId = null;
        state.enterprises.message = `Підприємство id ${id} видалено.`;
        await loadEnterprises();
    } catch (error) {
        setError("enterprises", error);
    }
}

export function startEditingEnterprise(id) {
    state.enterprises.editingId = id;
    state.enterprises.message = "";
    renderRoute();
}

export function cancelEditingEnterprise() {
    state.enterprises.editingId = null;
    renderRoute();
}

export async function loadProducts() {
    await loadEntity("products", productsApi);
}

export async function createProduct(data) {
    try {
        const created = await productsApi.create(data);
        state.products.message = `Створено продукцію id ${created.id}.`;
        await loadProducts();
    } catch (error) {
        setError("products", error);
    }
}

export async function updateProduct(id, data) {
    try {
        await productsApi.update(id, data);
        state.products.editingId = null;
        state.products.message = `Продукцію id ${id} оновлено.`;
        await loadProducts();
    } catch (error) {
        setError("products", error);
    }
}

export async function deleteProduct(id) {
    try {
        await productsApi.delete(id);
        if (state.products.editingId === id) state.products.editingId = null;
        state.products.message = `Продукцію id ${id} видалено.`;
        await loadProducts();
    } catch (error) {
        setError("products", error);
    }
}

export function startEditingProduct(id) {
    state.products.editingId = id;
    state.products.message = "";
    renderRoute();
}

export function cancelEditingProduct() {
    state.products.editingId = null;
    renderRoute();
}

export async function loadSupplies() {
    state.supplies.status = "loading";
    renderRoute();
    const needsLoad = key => state[key].status === "idle" || state[key].status === "error";
    try {
        const [items] = await Promise.all([
            suppliesApi.readAll(),
            needsLoad("enterprises") ? loadEnterprises() : null,
            needsLoad("products") ? loadProducts() : null,
        ]);
        state.supplies.items = items;
        state.supplies.status = "success";
        state.supplies.error = null;
    } catch (error) {
        state.supplies.status = "error";
        state.supplies.error = error.message;
    }
    renderRoute();
}

export async function createSupply(data) {
    try {
        const created = await suppliesApi.create(data);
        state.supplies.message = `Створено постачання id ${created.id}.`;
        await loadSupplies();
    } catch (error) {
        setError("supplies", error);
    }
}

export async function updateSupply(id, data) {
    try {
        await suppliesApi.update(id, data);
        state.supplies.editingId = null;
        state.supplies.message = `Постачання id ${id} оновлено.`;
        await loadSupplies();
    } catch (error) {
        setError("supplies", error);
    }
}

export async function deleteSupply(id) {
    try {
        await suppliesApi.delete(id);
        if (state.supplies.editingId === id) state.supplies.editingId = null;
        state.supplies.message = `Постачання id ${id} видалено.`;
        await loadSupplies();
    } catch (error) {
        setError("supplies", error);
    }
}

export function startEditingSupply(id) {
    state.supplies.editingId = id;
    state.supplies.message = "";
    renderRoute();
}

export function cancelEditingSupply() {
    state.supplies.editingId = null;
    renderRoute();
}
