function getLocalStorageJson(key){
    try {
        let jsonStr = localStorage.getItem(key);
        return JSON.parse(jsonStr);
    } catch (error) {
        console.log(error)
    }
    return undefined;
}

export{
    getLocalStorageJson
}