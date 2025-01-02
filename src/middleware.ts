import { withAuth } from 'next-auth/middleware';

export const config = {
  matcher: '/api/int/:function*',
}

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token?.id
  },
});