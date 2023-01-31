<script setup>
import UserProviderVue from "./components/providers/UserProvider.vue";
import LocalStorage from "./services/LocalStorage";

const role = LocalStorage.get("user").role;
</script>

<template>
	<UserProviderVue v-slot="{ logout, isAuth }">
		<section class="footer">
			<footer>
				<div class="social">
					<a href="#"><i class="icon fa fa-google"></i></a>
					<a href="#"><i class="icon fa fa-facebook"></i></a>
					<a href="#"><i class="icon fa fa-twitter"></i></a>
				</div>
				<ul class="list-inline">
					<li>
						<RouterLink to="/">Accueil</RouterLink>
					</li>
					<li v-if="isAuth">
						<RouterLink to="/conversation">Discussions</RouterLink>
					</li>
					<li v-if="isAuth">
						<RouterLink to="/chatbot">Chatbot</RouterLink>
					</li>
					<li v-if="isAuth">
						<RouterLink to="/help">Aide</RouterLink>
					</li>
					<li v-if="isAuth && role === 'admin'">
						<RouterLink to="/admin/dashboard">Administrateur</RouterLink>
					</li>
					<li v-if="isAuth" @click="logout" class="pointer">
						<a href="#">Déconnexion</a>
					</li>
					<li v-if="!isAuth">
						<RouterLink to="/register">S'enregistrer</RouterLink>
					</li>
					<li v-if="!isAuth">
						<RouterLink to="/login">Se connecter</RouterLink>
					</li>
				</ul>
				<p class="copyright">MotoMania © 2023</p>
			</footer>
		</section>
	</UserProviderVue>
</template>

<style scoped>
.footer {
	padding: 40px 0 20px 0;
	background-color: #ffffff;
	color: black;
}

.footer ul {
	padding: 0;
	list-style: none;
	text-align: center;
	font-size: 18px;
	line-height: 1.6;
	margin-bottom: 0;
}

.footer li {
	padding: 0 10px;
}

.footer ul a {
	color: inherit;
	text-decoration: none;
	opacity: 0.8;
}

.footer ul a:hover {
	opacity: 1;
	color: #f04c26 !important;
}

.footer .social {
	text-align: center;
	padding-bottom: 25px;
}

.footer .social > a {
	font-size: 24px;
	width: 40px;
	height: 40px;
	line-height: 40px;
	display: inline-block;
	text-align: center;
	border-radius: 50%;
	border: 1px solid black;
	margin: 0 8px;
	color: inherit;
	opacity: 0.75;
}

.footer .social > a:hover {
	color: #f04c26;
	opacity: 0.5;
}

@media (max-width: 480px) {
	.footer {
		padding-top: 30px;
	}

	.footer ul.list-inline {
		font-size: 15px;
	}
}

@media (max-width: 380px) {
	.footer ul.list-inline {
		font-size: 14px;
	}
}

.footer .social > a:hover {
	opacity: 0.9;
}

.footer a.router-link-active {
	color: #f04c26 !important;
}

.footer .copyright {
	margin-top: 15px;
	text-align: center;
	font-size: 13px;
	color: black;
	margin-bottom: 0;
}
</style>
