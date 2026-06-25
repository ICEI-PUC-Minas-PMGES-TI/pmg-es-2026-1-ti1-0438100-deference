// JavaScript da página criarNovaCampanha.html
document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('formCriarCampanha');
	const btnCancelar = document.getElementById('btnCancelar');

	const fields = {
		titulo: document.getElementById('campanhaTitulo'),
		categoria: document.getElementById('campanhaCategoria'),
		descricao: document.getElementById('campanhaDescricao'),
		meta: document.getElementById('campanhaMeta'),
		beneficiarios: document.getElementById('campanhaBeneficiarios'),
		local: document.getElementById('campanhaLocal'),
		inicio: document.getElementById('campanhaInicio'),
		fim: document.getElementById('campanhaFim'),
		org: document.getElementById('campanhaOrg'),
		email: document.getElementById('campanhaEmail'),
		tel: document.getElementById('campanhaTel')
	};

	function createFeedback(el, msg) {
		let fb = el.nextElementSibling;
		if (!fb || !fb.classList || !fb.classList.contains('invalid-feedback')) {
			fb = document.createElement('div');
			fb.className = 'invalid-feedback';
			el.insertAdjacentElement('afterend', fb);
		}
		fb.textContent = msg;
	}

	function clearValidation() {
		Object.values(fields).forEach(el => {
			el.classList.remove('is-invalid');
			el.classList.remove('is-valid');
			const fb = el.nextElementSibling;
			if (fb && fb.classList && fb.classList.contains('invalid-feedback')) fb.textContent = '';
		});
	}

	function applyPhoneMask(value) {
		const digits = value.replace(/\D/g, '');
		if (digits.length === 0) return '';
		if (digits.length <= 2) return `(${digits}`;
		if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
		return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
	}

	function applyCurrencyMask(value) {
		const digits = value.replace(/\D/g, '');
		if (digits.length === 0) return '';
		const numberValue = parseInt(digits, 10) / 100;
		return numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
	}

	// Apply phone mask on input
	fields.tel.addEventListener('input', (ev) => {
		const masked = applyPhoneMask(ev.target.value);
		ev.target.value = masked;
	});

	// Apply currency mask on input
	fields.meta.addEventListener('input', (ev) => {
		const masked = applyCurrencyMask(ev.target.value);
		ev.target.value = masked;
	});

	function validate() {
		clearValidation();
		const errors = {};

		const titulo = fields.titulo.value.trim();
		if (!titulo) errors.titulo = 'O título da campanha é obrigatório.';
		else if (titulo.length < 5) errors.titulo = 'O título deve ter ao menos 5 caracteres.';

		const categoria = fields.categoria.value;
		if (!categoria) errors.categoria = 'Selecione uma categoria.';

		const descricao = fields.descricao.value.trim();
		if (!descricao) errors.descricao = 'A descrição é obrigatória.';
		else if (descricao.length < 20) errors.descricao = 'A descrição deve ter ao menos 20 caracteres.';

		const meta = fields.meta.value.trim();
		const metaNumber = Number(meta.replace(/\./g, '').replace(',', '.'));
		if (!meta) errors.meta = 'Informe a meta de arrecadação.';
		else if (isNaN(metaNumber) || metaNumber <= 0) errors.meta = 'A meta deve ser um valor numérico maior que zero.';

		const beneficiarios = fields.beneficiarios.value.trim();
		if (!beneficiarios) errors.beneficiarios = 'Informe o número de beneficiários.';
		else if (!Number.isInteger(Number(beneficiarios)) || Number(beneficiarios) <= 0) errors.beneficiarios = 'Informe um número inteiro de beneficiários maior que zero.';

		const local = fields.local.value.trim();
		if (!local) errors.local = 'Informe o local ou região da campanha.';

		const inicio = fields.inicio.value;
		const fim = fields.fim.value;
		if (!inicio) errors.inicio = 'Data de início é obrigatória.';
		if (!fim) errors.fim = 'Data de término é obrigatória.';
		if (inicio && fim && new Date(inicio) > new Date(fim)) errors.fim = 'A data de término deve ser igual ou posterior à data de início.';

		const org = fields.org.value.trim();
		if (!org) errors.org = 'Informe o nome da organização responsável.';

		const email = fields.email.value.trim();
		const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email) errors.email = 'Informe um e-mail de contato.';
		else if (!emailRe.test(email)) errors.email = 'E-mail inválido.';

		const tel = fields.tel.value.trim();
		const digits = tel.replace(/\D/g, '');
		if (!tel) errors.tel = 'Informe um telefone para contato.';
		else if (digits.length < 8) errors.tel = 'Telefone inválido. Informe ao menos 8 dígitos.';

		// apply visuals
		if (errors.titulo) { fields.titulo.classList.add('is-invalid'); createFeedback(fields.titulo, errors.titulo); } else fields.titulo.classList.add('is-valid');
		if (errors.categoria) { fields.categoria.classList.add('is-invalid'); createFeedback(fields.categoria, errors.categoria); } else fields.categoria.classList.add('is-valid');
		if (errors.descricao) { fields.descricao.classList.add('is-invalid'); createFeedback(fields.descricao, errors.descricao); } else fields.descricao.classList.add('is-valid');
		if (errors.meta) { fields.meta.classList.add('is-invalid'); createFeedback(fields.meta, errors.meta); } else fields.meta.classList.add('is-valid');
		if (errors.beneficiarios) { fields.beneficiarios.classList.add('is-invalid'); createFeedback(fields.beneficiarios, errors.beneficiarios); } else fields.beneficiarios.classList.add('is-valid');
		if (errors.local) { fields.local.classList.add('is-invalid'); createFeedback(fields.local, errors.local); } else fields.local.classList.add('is-valid');
		if (errors.inicio) { fields.inicio.classList.add('is-invalid'); createFeedback(fields.inicio, errors.inicio); } else fields.inicio.classList.add('is-valid');
		if (errors.fim) { fields.fim.classList.add('is-invalid'); createFeedback(fields.fim, errors.fim); } else fields.fim.classList.add('is-valid');
		if (errors.org) { fields.org.classList.add('is-invalid'); createFeedback(fields.org, errors.org); } else fields.org.classList.add('is-valid');
		if (errors.email) { fields.email.classList.add('is-invalid'); createFeedback(fields.email, errors.email); } else fields.email.classList.add('is-valid');
		if (errors.tel) { fields.tel.classList.add('is-invalid'); createFeedback(fields.tel, errors.tel); } else fields.tel.classList.add('is-valid');

		return { valid: Object.keys(errors).length === 0, errors };
	}

	form.addEventListener('submit', async (ev) => {
		ev.preventDefault();
		const result = validate();
		if (!result.valid) {
			const firstInvalid = form.querySelector('.is-invalid');
			if (firstInvalid) firstInvalid.focus();
			alert('Por favor corrija os campos destacados antes de enviar.');
			return;
		}

		// build payload
		const payload = {
			titulo: fields.titulo.value.trim(),
			categoria: fields.categoria.value,
			descricao: fields.descricao.value.trim(),
			meta: Number(fields.meta.value.replace(/\./g, '').replace(',', '.')),
			beneficiarios: Number(fields.beneficiarios.value.trim()),
			local: fields.local.value.trim(),
			inicio: fields.inicio.value,
			fim: fields.fim.value,
			organizacao: fields.org.value.trim(),
			email: fields.email.value.trim(),
			telefone: fields.tel.value.replace(/\D/g, ''),
			criadoEm: new Date().toISOString()
		};

		try {
			const API = 'http://localhost:3000/campanhas';
			const resp = await fetch(API, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			if (!resp.ok) throw new Error(`Servidor retornou ${resp.status}`);
			const data = await resp.json();
			alert(`Campanha cadastrada com sucesso!`);
			form.reset();
			clearValidation();
		} catch (err) {
			console.error(err);
			alert('Falha ao cadastrar a campanha. Verifique a conexão com o servidor e tente novamente.');
		}
	});

	btnCancelar.addEventListener('click', () => {
		if (confirm('Deseja cancelar o cadastro e limpar o formulário?')) {
			form.reset();
			clearValidation();
		}
	});
});