import { state, createProduct, updateProduct, deleteProduct,
         startEditingProduct, cancelEditingProduct } from "../state.js";
import { renderTable, renderStatus } from "../components/table.js";

export function renderProducts() {
    const container = document.querySelector("#app");
    const { items, editingId } = state.products;

    container.innerHTML = `<div class="panel-head"><h2>Продукція</h2></div>`;
    if (!renderStatus(container, state.products)) return;

    renderProductForm(container, items.find(p => p.id === editingId));
    renderTable(container, items, [
        { key: "name", label: "Повна назва" },
        { key: "unit", label: "Одиниця вимірювання" },
        { key: "shelfLife", label: "Термін придатності" },
        { key: "purchasePrice", label: "Ціна закупівлі, грн" },
    ], { onEdit: startEditingProduct, onDelete: deleteProduct });
}

function renderProductForm(container, editing) {
    const section = document.createElement("div");
    section.className = "form-section";
    section.innerHTML = `
        <form>
            <h3 class="form-title">${editing ? `Редагування продукції (id ${editing.id})` : "Нова продукція"}</h3>
            <label>Повна назва <input name="name" required></label>
            <label>Одиниця вимірювання <input name="unit" required></label>
            <label>Термін придатності <input name="shelfLife" required></label>
            <label>Ціна закупівлі, грн <input name="purchasePrice" type="number" min="0" step="any" required></label>
            <div class="form-buttons">
                <button type="submit" class="save-btn">${editing ? "Зберегти зміни" : "Додати"}</button>
                ${editing ? `<button type="button" class="cancel-btn">Скасувати</button>` : ""}
            </div>
        </form>
    `;
    const form = section.querySelector("form");

    if (editing) {
        form.name.value = editing.name;
        form.unit.value = editing.unit;
        form.shelfLife.value = editing.shelfLife;
        form.purchasePrice.value = editing.purchasePrice;
        form.querySelector(".cancel-btn").addEventListener("click", cancelEditingProduct);
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        const data = {
            name: form.name.value,
            unit: form.unit.value,
            shelfLife: form.shelfLife.value,
            purchasePrice: Number(form.purchasePrice.value),
        };
        if (editing) updateProduct(editing.id, data);
        else createProduct(data);
    });

    container.append(section);
}
