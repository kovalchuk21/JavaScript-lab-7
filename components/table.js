export function renderTable(container, items, columns, { onEdit, onDelete }) {
    if (items.length === 0) {
        const p = document.createElement("p");
        p.className = "empty";
        p.textContent = "Записів поки немає.";
        container.append(p);
        return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "table-container";

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");

    for (const label of ["id", ...columns.map(col => col.label), "Дії"]) {
        const th = document.createElement("th");
        th.textContent = label;
        headRow.append(th);
    }
    thead.append(headRow);
    table.append(thead);

    const tbody = document.createElement("tbody");
    for (const item of items) {
        tbody.append(renderRow(item, columns));
    }
    table.append(tbody);

    table.addEventListener("click", event => {
        const id = Number(event.target.dataset.id);
        if (event.target.classList.contains("edit-btn")) {
            onEdit(id);
        }
        if (event.target.classList.contains("delete-btn")) {
            if (confirm(`Видалити запис id ${id}?`)) onDelete(id);
        }
    });

    wrapper.append(table);
    container.append(wrapper);
}

export function renderRow(item, columns) {
    const tr = document.createElement("tr");

    const idTd = document.createElement("td");
    idTd.textContent = item.id;
    tr.append(idTd);

    for (const col of columns) {
        const td = document.createElement("td");
        td.textContent = col.format ? col.format(item) : item[col.key];
        tr.append(td);
    }

    const actionsTd = document.createElement("td");
    actionsTd.innerHTML = `
        <button class="edit-btn" data-id="${item.id}">Редагувати</button>
        <button class="delete-btn" data-id="${item.id}">Видалити</button>
    `;
    tr.append(actionsTd);

    return tr;
}

export function renderStatus(container, entityState) {
    if (entityState.status === "loading") {
        container.innerHTML += `<p class="loading">Завантаження...</p>`;
        return false;
    }
    if (entityState.status === "error") {
        container.innerHTML += `<p class="message error">Помилка: ${entityState.error}</p>`;
        return false;
    }
    if (entityState.message) {
        container.innerHTML += `<p class="message">${entityState.message}</p>`;
    }
    return true;
}
