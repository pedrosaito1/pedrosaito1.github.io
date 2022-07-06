const typing = () => {
    const text = document.querySelector('#typing');
    const textArr = text.innerHTML.split('');
    text.innerHTML = ' '

    setTimeout(() => {
        textArr.forEach((letter, i) => {
            setTimeout(() => {
                text.innerHTML += letter;
            }, 100 * i)
        })
    }, 1400);
}

typing();