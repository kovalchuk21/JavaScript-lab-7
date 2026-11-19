import { renderEnterprises } from "./views/enterprises.js";
import { renderSupplies } from "./views/supplies.js";
import { renderProducts } from "./views/products.js";
import { state, loadEnterprises, loadSupplies, loadProducts } from "./state.js";

const DEFAULT_HASH = "#/enterprises";

const routes = {
    "#/enterprises": { render: renderEnterprises, load: loadEnterprises, key: "enterprises" },
    "#/supplies":    { render: renderSupplies,    load: loadSupplies,    key: "supplies" },
    "#/products":    { render: renderProducts,    load: loadProducts,    key: "products" },
};

export function renderRoute() {
    const hash = routes[window.location.hash] ? window.location.hash : DEFAULT_HASH;
    const route = routes[hash];

    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.hash === hash);
    });

    route.render();

    if (state[route.key].status === "idle") {
        route.load();
    }
}
