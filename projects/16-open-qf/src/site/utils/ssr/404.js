// redirect to 404 page
export function to404() {
  return redirect("/404");
}

export function redirect(url) {
  return {
    redirect: {
      permanent: false,
      destination: url,
    },
    props: {},
  };
}
