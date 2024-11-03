function updateProgress(value, id) {
  // Get the circle and text elements by their IDs
  const circle = document.getElementById(id);
  const text = document.getElementById(id + '-text');

  // Calculate the circumference of the circle
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  let offset;

  // Determine the offset based on the value and id
  if (value < 0) {
    offset = circumference;
  } else if ((id === 't' && value > 40) || (id === 'h' && value > 100)) {
    offset = 0;
  } else {
    offset = circumference - (value / (id === 't' ? 40 : 100)) * circumference;
  }

  // Set the stroke dash offset to create the progress effect
  circle.style.strokeDashoffset = offset;

  // Define the conditions for temperature and humidity
  const conditions = {
    t: [
      { max: 18, color: 'stroke-blue-500', label: '(Cold)' },
      { max: 24, color: 'stroke-green-500', label: '(Comfortable)' },
      { max: 28, color: 'stroke-yellow-500', label: '(Warm)' },
      { max: 32, color: 'stroke-orange-500', label: '(Hot)' },
      { max: Infinity, color: 'stroke-red-500', label: '(Very Hot)' }
    ],
    h: [
      { max: 30, color: 'stroke-blue-500', label: '(Dry)' },
      { max: 60, color: 'stroke-green-500', label: '(Comfortable)' },
      { max: 70, color: 'stroke-yellow-500', label: '(Humid)' },
      { max: 80, color: 'stroke-orange-500', label: '(Very Humid)' },
      { max: Infinity, color: 'stroke-red-500', label: '(Excessive)' }
    ]
  };

  // Find the appropriate condition based on the value
  const condition = conditions[id].find(cond => (value <= cond.max));

  // Remove previous color classes that start with 'stroke-'
  circle.classList.forEach(cls => {
    if (cls.startsWith('stroke-')) {
      circle.classList.remove(cls);
    }
  });

  // Add the new color class
  circle.classList.add(condition.color);

  // Update the text content with the value and condition label
  text.innerHTML = value + (id === 't' ? '&#8451;' : '&#37') + '<br>' + condition.label;
}

// Fetch data from the API and update the progress every 3 seconds
setInterval(async () => {
  try {
    const response = await fetch('/api');
    const data = await response.json();
    updateProgress(data.temperature, 't');
    updateProgress(data.humidity, 'h');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}, 3000);

// Uncomment the following lines to test the progress update function
// updateProgress(25, 't');
// updateProgress(50, 'h');

// Check the local storage for theme preference on page load
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark', 'bg-zinc-800', 'text-gray-100');
} else {
  document.body.classList.add('bg-gray-100');
}

// Get the theme toggle button
const themeToggle = document.getElementById('theme-toggle');
// Toggle the theme when the button is clicked
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('bg-gray-100');
  document.body.classList.toggle('bg-zinc-800');
  document.body.classList.toggle('text-gray-100');

  // Save the theme preference to local storage
  if (document.body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});