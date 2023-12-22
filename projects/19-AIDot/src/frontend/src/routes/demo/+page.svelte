<script>
    import NavBar from '../NavBar.svelte'
    import Footer from '../Footer.svelte'
    import { config } from '$lib/config.js'

    let iframeSrc = `${config.webUrl}/widget/asst_XJ4C1WohcQeMs9365h2a5gIt`;
</script>
<!--Static Landing Page-->
<div class="relative flex flex-col max-w-screen-2xl mx-auto ">


    <!--Iframe-->
    <iframe class="fixed bottom-0 right-0 w-[1000px] w-[1000px] z-50" src={iframeSrc}/>

</div>
