function onPageLoad() {
    const dayTimeTemplate = document.getElementsByName("dayTimeTemplate")[0];
    const timeSheetContainer = document.getElementsByName("timeSheetContainer")[0];
    for(let i = 0;i < 5;i++){
        const dayTime = dayTimeTemplate.content.cloneNode(true);
        timeSheetContainer.appendChild(dayTime);
    }
}
