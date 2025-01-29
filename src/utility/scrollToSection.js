export const scrollToSection = (section) => {
  if (section) {
    const sectionPosition = section.getBoundingClientRect().top;
    window.scrollTo({
      top: sectionPosition + window.scrollY - 90,
      behavior: "smooth",
    });
  }
};
