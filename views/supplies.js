import { state, createSupply, updateSupply, deleteSupply,
         startEditingSupply, cancelEditingSupply } from "../state.js";
import { renderTable, renderStatus } from "../components/table.js";

const DELIVERY_METHODS = ["автотранспорт", "автоцистерна", "залізниця", "самовивіз"];

export function renderSupplies() {
    const container = document.querySelector("#app");
    const { items, editingId } = state.supplies;
    const enterprises = state.enterprises.items;
    const products = state.products.items;

    container.innerHTML = `<div class="panel-head"><h2>Постачання</h2></div>`;
    if (!renderStatus(container, state.supplies)) return;

    renderSupplyForm(container, items.find(s => s.id === editingId), enterprises, products);
    renderTable(container, items, [
        { label: "Підприємство", format: s => enterprises.find(e => e.id === s.enterpriseId)?.name ?? "— (видалено)" },
        { label: "Продукція", format: s => products.find(p => p.id === s.productId)?.name ?? "— (видалено)" },
        { key: "date", label: "Дата" },
        { key: "volume", label: "Обсяг" },
        { key: "salePrice", label: "Ціна продажу, грн" },
        { key: "deliveryMethod", label: "Спосіб доставки" },
        { key: "invoiceNumber", label: "№ накладної" },
    ], { onEdit: startEditingSupply, onDelete: deleteSupply });
}

function renderSupplyForm(container, editing, enterprises, products) {
    const section = document.createElement("div");
    section.className = "form-section";
    section.innerHTML = `
        <form>
            <h3 class="form-title">${editing ? `Редагування постачання (id ${editing.id})` : "Нове постачання"}</h3>
            <label>Підприємство
                <select name="enterpriseId" required>
                    ${enterprises.map(e => `<option value="${e.id}">${e.name}</option>`).join("")}
                </select>
            </label>
            <label>Продукція
                <select name="productId" required>
                    ${products.map(p => `<option value="${p.id}">${p.name} (${p.unit})</option>`).join("")}
                </select>
            </label>
            <label>Дата <input name="date" type="date" required></label>
            <label>Обсяг <input name="volume" type="number" min="0" step="any" required></label>
            <label>Ціна продажу, грн <input name="salePrice" type="number" min="0" step="any" required></label>
            <label>Спосіб доставки
                <select name="deliveryMethod">
                    ${DELIVERY_METHODS.map(m => `<option>${m}</option>`).join("")}
                </select>
            </label>
            <label>Номер накладної <input name="invoiceNumber" required></label>
            <div class="form-buttons">
                <button type="submit" class="save-btn">${editing ? "Зберегти зміни" : "Додати"}</button>
                ${editing ? `<button type="button" class="cancel-btn">Скасувати</button>` : ""}
            </div>
        </form>
    `;
    const form = section.querySelector("form");

    if (editing) {
        form.enterpriseId.value = editing.enterpriseId;
        form.productId.value = editing.productId;
        form.date.value = editing.date;
        form.volume.value = editing.volume;
        form.salePrice.value = editing.salePrice;
        form.deliveryMethod.value = editing.deliveryMethod;
        form.invoiceNumber.value = editing.invoiceNumber;
        form.querySelector(".cancel-btn").addEventListener("click", cancelEditingSupply);
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        const data = {
            enterpriseId: Number(form.enterpriseId.value),
            productId: Number(form.productId.value),
            date: form.date.value,
            volume: Number(form.volume.value),
            salePrice: Number(form.salePrice.value),
            deliveryMethod: form.deliveryMethod.value,
            invoiceNumber: form.invoiceNumber.value,
        };
        if (editing) updateSupply(editing.id, data);
        else createSupply(data);
    });

    container.append(section);
}
