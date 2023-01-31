<script setup>
import UserProviderVue from "./components/providers/UserProvider.vue";
</script>

<template>
	<UserProviderVue v-slot="{ logout, isAuth }">
		<div class="footer-basic">
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
					<li v-if="isAuth">
						<RouterLink to="/admin/dashboard">Administrateur</RouterLink>
					</li>
					<li v-if="isAuth" @click="logout" class="pointer">
						<a>Déconnexion</a>
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
		</div>
	</UserProviderVue>
</template>

<style scoped>
.footer-basic {
	padding: 40px 0 20px 0;
	background-color: #ffffff;
	color: #4b4c4d;
}

.footer-basic ul {
	padding: 0;
	list-style: none;
	text-align: center;
	font-size: 18px;
	line-height: 1.6;
	margin-bottom: 0;
}

.footer-basic li {
	padding: 0 10px;
}

.footer-basic ul a {
	color: inherit;
	text-decoration: none;
	opacity: 0.8;
}

.footer-basic ul a:hover {
	opacity: 1;
	color: #f04c26;
}

.footer-basic .social {
	text-align: center;
	padding-bottom: 25px;
}

.footer-basic .social > a {
	font-size: 24px;
	width: 40px;
	height: 40px;
	line-height: 40px;
	display: inline-block;
	text-align: center;
	border-radius: 50%;
	border: 1px solid #ccc;
	margin: 0 8px;
	color: inherit;
	opacity: 0.75;
}

.footer-basic .social > a:hover {
	color: #f04c26;
	opacity: 0.5;
}

@media (max-width: 480px) {
	.footer-basic {
		padding-top: 30px;
	}

	.footer-basic ul.list-inline {
		font-size: 15px;
	}
}

@media (max-width: 380px) {
	.footer-basic ul.list-inline {
		font-size: 14px;
	}
}

.footer-basic .social > a:hover {
	opacity: 0.9;
}

.footer-basic .copyright {
	margin-top: 15px;
	text-align: center;
	font-size: 13px;
	color: #aaa;
	margin-bottom: 0;
}
</style>
