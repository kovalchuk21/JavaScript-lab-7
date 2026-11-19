import { state, createEnterprise, updateEnterprise, deleteEnterprise,
         startEditingEnterprise, cancelEditingEnterprise } from "../state.js";
import { renderTable, renderStatus } from "../components/table.js";

export function renderEnterprises() {
    const container = document.querySelector("#app");
    const { items, editingId } = state.enterprises;

    container.innerHTML = `<div class="panel-head"><h2>Підприємства</h2></div>`;
    if (!renderStatus(container, state.enterprises)) return;

    renderEnterpriseForm(container, items.find(e => e.id === editingId));
    renderTable(container, items, [
        { key: "name", label: "Назва" },
        { key: "workersCount", label: "Кількість працюючих" },
        { key: "activity", label: "Вид діяльності" },
    ], { onEdit: startEditingEnterprise, onDelete: deleteEnterprise });
}

function renderEnterpriseForm(container, editing) {
    const section = document.createElement("div");
    section.className = "form-section";
    section.innerHTML = `
        <form>
            <h3 class="form-title">${editing ? `Редагування підприємства (id ${editing.id})` : "Нове підприємство"}</h3>
            <label>Назва <input name="name" required></label>
            <label>Кількість працюючих <input name="workersCount" type="number" min="1" required></label>
            <label>Вид діяльності <input name="activity" required></label>
            <div class="form-buttons">
                <button type="submit" class="save-btn">${editing ? "Зберегти зміни" : "Додати"}</button>
                ${editing ? `<button type="button" class="cancel-btn">Скасувати</button>` : ""}
            </div>
        </form>
    `;
    const form = section.querySelector("form");

    if (editing) {
        form.name.value = editing.name;
        form.workersCount.value = editing.workersCount;
        form.activity.value = editing.activity;
        form.querySelector(".cancel-btn").addEventListener("click", cancelEditingEnterprise);
    }

    form.addEventListener("submit", event => {
        event.preventDefault();
        const data = {
            name: form.name.value,
            workersCount: Number(form.workersCount.value),
            activity: form.activity.value,
        };
        if (editing) updateEnterprise(editing.id, data);
        else createEnterprise(data);
    });

    container.append(section);
}
