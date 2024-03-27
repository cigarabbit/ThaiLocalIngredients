async function loadData() {
    try {
        const response = await fetch('/data');
        return await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

async function autoComplete() {
    let query = document.getElementById('targetInput').value;
    let suggestionList = document.getElementById('suggestionList');

    suggestionList.innerHTML = '';

    try {
        const data = await loadData();

        if (query.length >= 2) {
            let ingredientList = retrieveMatchIngredient(data, query);

            ingredientList.forEach(ingredient => {
                let listItem = createAndAppendListItem(ingredient, suggestionList);

                listItem.addEventListener('click', () => {
                    document.getElementById('targetInput').value = ingredient;

                    suggestionList.style.display = 'none';
                });
            })

            suggestionList.style.display = 'block';
            suggestionList.style.border = '1px solid #dee2e6';
        }

    } catch (e) {
        console.log(e);
    }

}

function retrieveMatchIngredient(data, query) {
    let ingredientList = [];

    for (let category in data) {
        for (let ingredient in data[category]) {
            if (ingredient.toLowerCase().includes(query))
            ingredientList.push(ingredient);
        }
    }

    return ingredientList;
}

function createAndAppendListItem(text, parent, bold = false) {
    let listItem = document.createElement('li');
    listItem.textContent = text;
    if (bold) listItem.style.fontWeight = 'bold';
    listItem.style.borderBottom = '1px solid #dee2e6';

    parent.appendChild(listItem);

    return listItem;
}