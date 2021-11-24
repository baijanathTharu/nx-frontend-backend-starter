import 'reflect-metadata';
import { gCall } from '../../utils/index';

const registerMutation = `
mutation {
  register(
    registerInput: {
      firstName: "john",
      lastName: "doe",
      email: "john2@doe.com",
      password: "password",
    }
  ) {
    id
    email
    firstName
    lastName
  }
}
`;
describe('userResolver', () => {
  it('register user', async () => {
    const test = await gCall({
      source: registerMutation,
    });

    console.log('test', test);
  });
});
