<script setup></script>
<template>
	<section class="about">
		<div class="banner-heading">
			<h2>À propos de nous</h2>
			<p class="description">
				Notre groupe est un leader mondial dans la production et la vente de
				motos haut de gamme. Nous sommes fiers de notre héritage de plus de 100
				ans dans l'industrie de la moto et continuons de développer des produits
				innovants pour nos clients dans le monde entier. Avec des usines en
				Europe, en Asie et en Amérique du Nord, nous sommes déterminés à fournir
				un service exceptionnel à chaque client, peu importe où ils se trouvent.
				Nous croyons fermement que la qualité, la sécurité et le style sont les
				clés du succès de notre entreprise. Rejoignez notre famille de
				passionnés de moto et faites l'expérience de la liberté sur deux roues.
			</p>
		</div>
	</section>
</template>

<style>
.about {
	width: 100%;
}

.about .banner-heading {
	margin: 0 50px;
}

@media (max-width: 500px) {
	.about .banner-heading {
		margin: 0 15px;
	}
}

@media (max-width: 480px) {
	.about .banner-heading h2 {
		margin: 30px auto !important;
		font-size: 25px !important;
	}

	.about .banner-heading h2::before {
		top: 16px !important;
		right: -65px !important;
	}

	.about .banner-heading h2::after {
		top: 16px !important;
		left: -65px !important;
	}
}

@media (max-width: 405px) {
	.about .banner-heading h2 {
		font-size: 20px !important;
	}

	.about .banner-heading h2::before {
		top: 12px !important;
		right: -35px !important;
	}

	.about .banner-heading h2::after {
		top: 12px !important;
		left: -35px !important;
	}
}

@media (max-width: 350px) {
	.about .banner-heading h2::before {
		width: 50px !important;
		right: -10px !important;
	}

	.about .banner-heading h2::after {
		width: 50px !important;
		left: -10px !important;
	}
}

.about .description {
	text-align: center;
}

@media (max-width: 480px) {
	.about .description {
		font-size: 12px;
	}
}

.about .banner-heading h2 {
	text-align: center;
	font-weight: bold;
	font-size: 30px;
	position: relative;
	margin: 70px auto;
	max-width: 265px;
	width: 100%;
}

.about .banner-heading h2::after {
	border-top: 3px solid #f04c26;
	width: 70px;
	position: absolute;
	content: " ";
	top: 22px;
	left: -100px;
}

.about .banner-heading h2::before {
	border-top: 3px solid #f04c26;
	width: 70px;
	position: absolute;
	content: " ";
	top: 22px;
	right: -100px;
}
</style>
