export const getMultiLevelCategory = (categoryList) => {

    const categories = [];
    let retVal = getMultiLevelCategory_Sub(categories, categoryList, "0");
    // console.log("retValdddd", retVal, categoryList)
    return categories;
}

const getMultiLevelCategory_Sub = (categories, categoryList, parentCategoryID) => {

    categoryList.map(category => { if (category.parentCategoryID == parentCategoryID) { categories.push({ ...category, subCategories: getMultiLevelCategory_Sub([], categoryList, category.categoryID) }) } });
    // console.log("level", categories);
    return categories;
}

// export const getMultiLevelcategoriesForDropdown = (categoryList, labelColumn, valueColumn) => {
//     const categories = getMultiLevelCategory(categoryList);

//     let returnableArray = [];

// }

export const getMultiLevelcategoriesForDropdown = (categories, returnableArray = [{ value: "0", label: "--Select Parent Category--" }]) => {

    return getMultiLevelcategoriesForDropdown_Sub(getMultiLevelCategory(categories), returnableArray);
}

const getMultiLevelcategoriesForDropdown_Sub = (categories, returnableArray = []) => {

    categories.map(category => {
        //console.log("this category", category);
        returnableArray.push({ value: category.categoryID, label: category.en_CategoryName }); if (category.subCategories.length > 0) { returnableArray.push({ label: "Sub Categries Under: " + category.en_CategoryName, options: getMultiLevelcategoriesForDropdown_Sub(category.subCategories) }) }
    })
    returnableArray.sort(compare);
    return returnableArray;
}

function compare(a, b) {
    if ((a.hasOwnProperty('value')) && (b.hasOwnProperty('value'))) {
        return 0;
    } else if ((!a.hasOwnProperty('value')) && (!b.hasOwnProperty('value'))) {
        return 0;
    } else if (a.hasOwnProperty('value')) {
        return -1;
    } else {
        return 1;
    }
}

//