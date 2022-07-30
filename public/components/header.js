class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <header>
            <!-- Top navigation bar - collapsible on small screens - always stays at the top even when scrolling-->
            <nav class="navbar sticky-top navbar-fixed-top">
                <div class="navbar-header">
                    <img id="logo" src="https://c8.alamy.com/comp/2E4C6GC/you-and-me-lettering-hand-drawn-isolated-on-white-background-decorated-with-hearts-and-floral-elements-text-quote-motivation-vector-illustration-2E4C6GC.jpg">  
                    <ul id="navbar-left" class="nav navbar-nav navbar-right">
                        <li><a href="index.html">Home</a></li>
                    </ul>
                </div>
                <!-- Links in this part collapse within three lines menu on small screen -->
                <div id="topNavbar">
                    <!-- Sign in/ log out links -->
                    <div id="hide-when-signed-in">
                        <span id="sign-in-header" class="auth" auth="show-sign-in-form">Sign In</span>
                        <button id="create-user-header" class="auth" auth="show-create-user-form">Create User</button>
                    </div
                </div>
            </nav>

            <!-- Hero image and call for action at top of the page, below navbar -->
            <div class="below-navbar">
                <div class="hero-image">
                    <div class="hero-text">
                        <h1 id="hero-text">You & Me</h1>
                        <h2>Planning the perfect wedding, made easy</h2>
                    </div>
                    <!-- breadcrumbs on top left of hero image to remind user on what page they are -->
                    <nav id="breadcrumb" aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item active" aria-current="page">Home</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </header>
        `
    }
}

customElements.define('header-component', Header);