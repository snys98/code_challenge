import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';

const Apollo = new ApolloClient({
    link: new HttpLink({
        uri: 'http://localhost:3000/graphql',
    }),
    cache: new InMemoryCache()
});
const AppApolloProvider = (props: { children: React.ReactNode }) => ApolloProvider({ ...props, client: Apollo });
export default AppApolloProvider
