export function redirect(url) {
  return {
    redirect: {
      permanent: false,
      destination: url,
    },
    props: {},
  };
}
