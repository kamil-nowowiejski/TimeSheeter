function showElement(elementName) {
    const contentContainer = document.getElementsByClassName('content-container')[0]
    if (contentContainer.children.length > 0)
        contentContainer.removeChild(contentContainer.children[0])
    const element = document.createElement(elementName)
    contentContainer.appendChild(element)
}

const handler = {
    set: function(target, prop, value){
        if(prop == 'selectedTab'){
            target[prop] = value
            showElement(value)
            console.log(value)
            return true;
        }
    }
}

export const state = new Proxy(
    {
        selectedTab: 'time-sheet-table'
    },
    handler
)
