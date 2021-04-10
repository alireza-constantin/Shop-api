const deleteBtn = (btn) => {
  const prodId = btn.parentElement.querySelector('[name=productId]').value;
  const csrf = btn.parentElement.querySelector('[name=_csrf]').value;
  const prodElement = btn.closest('article');
  fetch(`/admin/product/${prodId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf,
    },
  })
    .then(() => {
      prodElement.remove();
    })
    .catch((err) => console.log(err));
};
