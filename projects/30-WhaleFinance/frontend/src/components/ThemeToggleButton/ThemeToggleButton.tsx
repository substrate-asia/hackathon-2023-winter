const ThemeToggleButton = () => {

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDarkMode = root.classList.toggle('dark');
    console.log(isDarkMode);
    // Store the theme preference in localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    console.log(localStorage.getItem('theme'));
  };

  return (
    <button onClick={toggleTheme}>
      Toggle Theme
    </button>
  );
};

export default ThemeToggleButton;