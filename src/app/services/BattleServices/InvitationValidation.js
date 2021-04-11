import * as Yup from 'yup';

export default Yup.object().shape({
  challenged_id: Yup.string().required(),
  challenger_available_dates: Yup.array()
    .of(Yup.date())
    .min(3, 'Should at least send 3 different dates')
    .required(),
  challenge_type: Yup.string(),
  position_id: Yup.number().when('challenge_type', (challenge_type, field) =>
    challenge_type === 'position' ? field.required() : field
  ),
});
