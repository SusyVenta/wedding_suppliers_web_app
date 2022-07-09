class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <footer class="text-center text-lg-start" id="footer">
            <!-- Container for grid -->
            <div class="container-fluid" id="footer-content">
                <div class="row align-items-center">
                    <div class="col-3 text-left">
                        <address>
                            (706) 270-8409 <br>
                            1304 Beverly Dr <br>
                            Dalton, Georgia(GA) <br>
                            30720
                        </address>
                    </div>
                    <div class="col-6 text-center">
                    <p>You And Me, All Right Reserved </p>
                    </div>
                    <!-- Social Media -->
                    <div class="col-3 text-right">
                        <!-- Facebook -->
                        <a
                        class="btn btn-primary btn-floating m-1"
                        style="background-color: #3b5998;"
                        href="#!"
                        role="button"
                        ><i class="fab fa-facebook-f"></i
                        ></a>

                        <!-- Twitter -->
                        <a
                        class="btn btn-primary btn-floating m-1"
                        style="background-color: #55acee;"
                        href="#!"
                        role="button"
                        ><i class="fab fa-twitter"></i
                        ></a>

                        <!-- Instagram -->
                        <a
                        class="btn btn-primary btn-floating m-1"
                        style="background-color: #ac2bac;"
                        href="#!"
                        role="button"
                        ><i class="fab fa-instagram"></i
                        ></a>
                    </div>
                </div>
            </div>
        </footer>
        `
    }
}

customElements.define('footer-component', Footer);