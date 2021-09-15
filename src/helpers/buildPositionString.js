export default (position) => {
  switch (position.position_type) {
    case 'gym':
      return `Ginásio de ${position.name}`;

    case 'elite':
      return `Elite ${position.name}`;

    case 'champion':
      return 'Campeão';

    default:
      return 'foda-se';
  }
};
