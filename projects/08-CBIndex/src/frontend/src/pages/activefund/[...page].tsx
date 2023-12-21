import React from "react";
import { useRouter } from "next/router";
import VaultsPage from "../../../containers/VaultPage/VaultPage";
import CreateVaultPage from "../../../containers/CreateVaultPage/CreateVaultPage";
import DetailsPage from "../../../containers/DetailsPage/DetailsPage";


const ActiveFund = () => {
    const router = useRouter()


    const page = () => {
        switch (router.query.page?.length) {
            case 1:
                switch (router.query.page[0]) {
                    case "vaults":
                        return <VaultsPage />
                    case "createactivefund":
                        return <CreateVaultPage />
                    default:
                        return <>NoPage</>
                }
            case 2:
                switch (router.query.page[1]) {
                    case "details":
                        return <DetailsPage />
                    default:
                        return <>NoPage</>
                }
        }
    }

    return <>{page()}</>
}

export default ActiveFund



export async function getStaticPaths() {
    const paths = [
        { params: { page: ['vaults'] } },
        { params: { page: ['vaults', 'details'] } },
        { params: { page: ['createactivefund'] } },
    ];
    return {
        paths,
        fallback: false,
    };
}
export async function getStaticProps() {
    // extract the locale identifier from the URL
    // const { locale } = context;

    return {
        props: {
            // pass the translation props to the page component
            // ...(await serverSideTranslations(locale)),
        },
    };
}