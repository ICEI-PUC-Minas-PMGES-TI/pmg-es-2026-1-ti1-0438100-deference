function iniciarRevelacaoSuave() {
	const elementos = document.querySelectorAll('.item-timeline, .card-publico, .painel-resumo-fluxo, .secao-cta-final .container');

	if (!('IntersectionObserver' in window)) return;

	const observer = new IntersectionObserver((entradas) => {
		entradas.forEach((entrada) => {
			if (!entrada.isIntersecting) return;

			entrada.target.classList.add('visivel');
			observer.unobserve(entrada.target);
		});
	}, { threshold: 0.15 });

	elementos.forEach((el) => {
		el.classList.add('revelar');
		observer.observe(el);
	});
}

document.addEventListener('DOMContentLoaded', () => {
	iniciarRevelacaoSuave();
});
