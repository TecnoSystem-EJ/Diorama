export default function Navbar() {

    return (

        <header
            className="
flex
justify-between
items-center
px-8
md:px-20
py-8
"
        >

            <div
                className="
font-serif
text-3xl
"
            >
                LOGO
            </div>


            <nav>

                <ul
                    className="
flex
gap-8
text-sm
uppercase
"
                >

                    <li>
                        <a href="/">
                            Home
                        </a>
                    </li>


                    <li>
                        <a href="/sobre">
                            Sobre nós
                        </a>
                    </li>


                    <li>
                        <a href="/edicoes">
                            Edições
                        </a>
                    </li>


                    <li>
                        <a href="/projetos">
                            Projetos
                        </a>
                    </li>


                </ul>

            </nav>


        </header>


    )

}