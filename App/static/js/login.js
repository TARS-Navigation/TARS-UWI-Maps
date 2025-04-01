document.addEventListener("DOMContentLoaded", () => {
    const dynamicImage = document.getElementById("dynamic-image");
    const classes = ["dynamic-image1", "dynamic-image2"];
    let currentIndex = 0;

    dynamicImage.addEventListener("animationiteration", () => { 
        console.log(classes[currentIndex]);

        dynamicImage.classList.remove(classes[currentIndex]);

        currentIndex = (currentIndex + 1) % classes.length;
        
        dynamicImage.classList.add(classes[currentIndex]);

    });

});