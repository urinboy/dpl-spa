import React from 'react';

const Meta = ({ title, description, keywords }) => {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </>
  );
};

Meta.defaultProps = {
  title: 'Dom Product - Onlayn Do`kon',
  description: 'O`zbekistondagi eng yaxshi onlayn do`kon. Mahsulotlarni arzon narxlarda toping.',
  keywords: 'onlayn do`kon, e-commerce, o`zbekiston, arzon narxlar, dom product',
};

export default Meta;