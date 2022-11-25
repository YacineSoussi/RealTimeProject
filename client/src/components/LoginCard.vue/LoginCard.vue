<script setup>
import { ref, reactive, computed } from 'vue'
import AuthLogic from '../../logics/AuthLogic';
import router from '../../router';


const isLoading = ref(false);
const showPassword = ref(false);

const form = reactive({
  email: '',
  password: '',
});

const onSubmit = () => {
    isLoading.value = true;
    AuthLogic.login({...form})
        .then(() => {
        isLoading.value = false;
        redirectToHome();
        })
        .catch(() => {
        isLoading.value = false;
        
        });
    };

const redirectToHome = () => {
    router.push({ name: 'home' });
    };

const isEmail = () => {
    const re = /\S+@\S+\.\S+/;
    const email = form.email;
    if(!re.test(email)) {
        errors.email = 'Email is invalid';
    } else {
        errors.email = '';
    }
    };

const isPassword = () => {
    const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    const password = form.password;
     if(!re.test(password)) {
        errors.password = 'Password must contain at least one number, one lowercase and one uppercase letter and at least six characters';
     } else {
        errors.password = '';
     }
    };

const typePassword = computed(() => {
  return showPassword.value ? 'text' : 'password';
});

const errors = reactive({
  email: '',
  password: '',
});


</script>

<template>
    <div class="global p-5">
        <div class="block p-5">
            <div class="block__title">
                <h1 class="block__title-text">Login</h1>
            </div>
            <div class="block__content">
                <form class="form" @submit.prevent="onSubmit">
                    <div class="form__group">
                        <label class="form__label" for="email">Email</label>
                        <input class="form__input" type="email" id="email" v-model="form.email" @input="isEmail" />
                    </div>
                    <div class="form__group">
                        <label class="form__label" for="password">Password</label>
                        <div class="form__input-group">
                            <input class="form__input" :type="typePassword" id="password" v-model="form.password" @input="isPassword" />
                            <button class="form__input-button" :class="errors ? 'red' : null" type="button" @click="showPassword = !showPassword">
                                <font-awesome-icon icon="eye" />
                            </button>
                        </div>
                    </div>
                    <div class="errors">
                        <div class="error messageErrors m-2" v-if="errors.email"> <li> Veuillez saisir un email valide </li></div>
                        <div class="error messageErrors m-2" v-if="errors.password"><li>{{errors.password}}</li> </div>
                    </div>
                    <div class="form__group">
                        <button class="form__button" type="submit" :disabled="isLoading">
                            <span v-if="isLoading">Loading...</span>
                            <span v-else>Login</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>  
    </div>

</template>

<style scoped>
.block {
    width: 100%;
    max-width: 20%;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.global {
display: flex;
justify-content: center;
align-items: center;
/* min-height: 1000px; */
}

.form__group {
    margin-bottom: 20px;
}

.form__input-group {
    position: relative;
}

.form__input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.form__input-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
    border: none;
    background: none;
    cursor: pointer;
}

.form__input-icon {
    font-size: 20px;
}

.form__button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background: #ccc;
    cursor: pointer;
}

.messageErrors {
  color: red;

}
</style>