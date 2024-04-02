function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    let scrollToTopBtn = document.getElementById("scrollToTopBtn");

    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}

/** Data Retrieval **/
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

        if (query.length < 2) {
            suggestionList.style.display = 'none';
        }
        if (query.length >= 2) {
            let ingredientList = retrieveMatchIngredient(data, query);

            ingredientList.forEach(ingredient => {
                let listItem = createAndAppendListItem(ingredient.ingredient, suggestionList);

                listItem.addEventListener('click', () => {
                    document.getElementById('targetInput').value = ingredient.ingredient;

                    suggestionList.style.display = 'none';
                });
            })

            suggestionList.style.display = 'block';
            suggestionList.style.zIndex = '1000';
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
            if (ingredient.toLowerCase().includes(query.toLowerCase())) {
                ingredientList.push({ingredient: ingredient, category: category});
            }
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

function containsThai(text) {
    const thaiRegex = /[\u0E00-\u0E7F]/; // Thai Unicode range
    return thaiRegex.test(text);
}

window.addEventListener('load', function () {
    setThaiName();
});

async function setThaiName() {
    let ingredientList = document.querySelectorAll('.substitution-key');

    if (ingredientList) {
        try {
            const data = await loadData();

            let ingredientTopic = document.getElementById('resultHeaderSpan');
            let thaiTopic = findThaiNameByEnglishName(data, ingredientTopic.textContent);

            if (thaiTopic !== undefined) {
                ingredientTopic.textContent += ' (' + thaiTopic + ')';
            }

            ingredientList.forEach(substitution => {
                let englishName = substitution.textContent;
                let thaiName = findThaiNameByEnglishName(data, englishName);

                substitution.textContent += ' (' + thaiName + ')';
            })

        } catch (e) {
            console.log(e);
        }

    }
}

function findThaiNameByEnglishName(data, englishName) {
        for (let category in data) {
            for (let ingredient in data[category]) {
                if (ingredient === englishName) {
                    let curr_ingredient = data[category][ingredient];
                    if ('hasOtherNames' in curr_ingredient) {
                        let synName = curr_ingredient['hasOtherNames'];
                        for (let eachName of synName) {
                            if (containsThai(eachName)) {
                                return eachName;
                            }
                        }
                    }
                }

            }
        }
}
