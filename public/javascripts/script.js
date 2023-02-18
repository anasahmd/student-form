// Show hide password
const show = document.getElementById('show');
const hide = document.getElementById('hide');
const password = document.getElementById('password');

if (show || hide) {
  show.addEventListener('click', () => {
    hide.style.display = 'block';
    show.style.display = 'none';
    password.type = 'text';
  });

  hide.addEventListener('click', () => {
    show.style.display = 'block';
    hide.style.display = 'none';
    password.type = 'password';
  });
}
