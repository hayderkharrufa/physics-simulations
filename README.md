# Physics Simulations

Browser-based physics experiments for teaching, in English and Arabic.

https://hayderkharrufa.github.io/physics-simulations/

| Experiment | |
|---|---|
| [Geiger–Müller Counter](geiger-muller-counter/) | Alpha, beta and gamma radiation through lead, plastic and cardboard barriers |
| [Millikan Oil Drop](millikan-oil-drop/) | Balancing a charged oil drop to measure its charge in multiples of e |

## Adding an experiment

Each experiment is a folder with its own `index.html`, `css/styles.css` and `js/`. Shared pieces live at the root: `css/base.css` for the page styling and `js/i18n.js` for the English/Arabic switching, which takes a `translations` dictionary from the experiment. Add a card to `index.html` to list it.

## Run locally

```sh
python3 -m http.server
```

Open http://localhost:8000.

## Tests

```sh
node --test
```

## License

[MIT](LICENSE)
