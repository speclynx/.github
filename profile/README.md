<div align="center">

<a href="https://speclynx.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logos/speclynx-logo-dark.png" />
    <img width="280" alt="SpecLynx" src="assets/logos/speclynx-logo-light.png" />
  </picture>
</a>

### One toolchain for every API spec

Parse, validate, transform, and lint **OpenAPI**, **AsyncAPI**, **Arazzo**, **Overlay**, and **JSON Schema** through one shared semantic structure. Local-first and lossless.

<sub>Built by long-time maintainers of Swagger UI and Swagger Editor, OpenAPI Initiative contributors, and AsyncAPI spec maintainers.</sub>

<br/>
<br/>

<p><a href="https://speclynx.com/docs/guides/getting-started/"><img height="34" alt="Get started" src="https://img.shields.io/badge/Get_started_%E2%86%92-3A97CC?style=for-the-badge" /></a></p>

[![Try the Editor](https://img.shields.io/badge/Try_the_Editor-092B4E?style=for-the-badge&logoColor=white)](https://editor.speclynx.com)
[![Discussions](https://img.shields.io/badge/Discussions-092B4E?style=for-the-badge&logo=github&logoColor=white)](https://github.com/orgs/speclynx/discussions)
[![License: Apache 2.0](https://img.shields.io/badge/Apache_2.0-092B4E?style=for-the-badge&logoColor=white)](https://github.com/speclynx/.github/blob/main/LICENSE)

<br/>
<br/>

  <a href="https://www.openapis.org/"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/logos/openapi-logo-dark.png" /><img height="36" alt="OpenAPI" src="https://speclynx.com/assets/images/logos/openapi-logo.png" /></picture></a>&nbsp;&nbsp;
  <a href="https://www.asyncapi.com/"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/logos/asyncapi-logo-dark.svg" /><img height="36" alt="AsyncAPI" src="https://speclynx.com/assets/images/logos/asyncapi-logo.svg" /></picture></a>&nbsp;&nbsp;
  <a href="https://spec.openapis.org/arazzo/latest.html"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/logos/arazzo-logo-dark.png" /><img height="36" alt="Arazzo" src="https://speclynx.com/assets/images/logos/arazzo-logo.png" /></picture></a>&nbsp;&nbsp;
  <a href="https://spec.openapis.org/overlay/latest.html"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/logos/overlay-logo-dark.svg" /><img height="36" alt="Overlay" src="https://speclynx.com/assets/images/logos/overlay-logo.svg" /></picture></a>&nbsp;&nbsp;
  <a href="https://json-schema.org/"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/logos/json-schema-logo-dark.svg" /><img height="36" alt="JSON Schema" src="https://speclynx.com/assets/images/logos/json-schema-logo.svg" /></picture></a>

</div>

## Get started

Validate any spec from the terminal. Nothing to install, no account:

```sh
npx @speclynx/cli validate openapi.yaml
npx @speclynx/cli validate asyncapi.yaml
npx @speclynx/cli validate arazzo.yaml
npx @speclynx/cli validate overlay.yaml
```

<a href="https://speclynx.com/cli/"><img alt="speclynx validate reporting problems with line ranges and rule codes in OpenAPI, AsyncAPI, Arazzo, and Overlay documents" src="assets/validate-demo.svg" /></a>

Apply or generate overlays:

```sh
npx @speclynx/cli overlay apply add-contact.yaml museum.yaml
npx @speclynx/cli overlay diff openapi-v1.yaml openapi-v2.yaml
```

<a href="https://speclynx.com/cli/"><img alt="speclynx overlay apply adding a contact to an OpenAPI document, and overlay diff generating an Overlay document from two OpenAPI versions" src="assets/overlay-demo.svg" /></a>

Prefer a UI? Open the [SpecLynx Editor](https://editor.speclynx.com) in your browser, or install the [OpenAPI Toolkit](https://speclynx.com/openapi-toolkit/) for VS Code. More in the [getting started guide](https://speclynx.com/docs/guides/getting-started/).

<a href="https://editor.speclynx.com"><img width="795" alt="SpecLynx Editor in the browser, editing an OpenAPI document with a live API reference preview" src="https://editor.speclynx.com/speclynx-editor.png" /></a>

## The tools

SpecLynx combines core tooling, developer workflows, and editing surfaces into one consistent stack, plus a workflow toolkit built on top of it. All of it is open source under Apache 2.0.

| Tool | What it does | Type |
| :--- | :----------- | :--- |
| [**CLI**](https://speclynx.com/cli/) | Validate specs and apply overlays from the terminal and CI. | Command line |
| [**Editor**](https://speclynx.com/editor/) | Write and validate specs in the browser, nothing to install. | Browser editor |
| [**OpenAPI Toolkit**](https://speclynx.com/openapi-toolkit/) | Validation, completion, and preview while you author specs. | VS Code extension |
| [**Language Service**](https://speclynx.com/language-service/) | LSP intelligence for API specs, in any editor or platform. | Integration library |
| [**ApiDOM**](https://speclynx.com/apidom/) | Parse, dereference, and bundle any API spec through one lossless semantic structure. | Core library |
| [**UseArazzo**](https://usearazzo.com) | Validate, run, and trace Arazzo API workflows. Built on SpecLynx. | Workflow toolkit |

## Why SpecLynx is different

Your API specs may be standardized, but the tooling around them rarely is. Every format and version brings its own validator, linter, and converter, and every job brings another script in CI. The result is duplicated logic, checks that disagree, and fragile automation around the contracts your systems depend on.

- **One semantic structure, not five parsers.** Every spec is parsed into [ApiDOM](https://speclynx.com/apidom/), one lossless, error-recovering structure with the semantics of each specification layered on top. Tools built on it behave the same way across every supported spec.
- **Local-first, always.** Runs on your machine. No accounts, no telemetry, and it works offline. Your specs never leave your environment. [Read the manifesto →](https://speclynx.com/manifesto/)
- **Built by the people who built the ecosystem.** We have spent years building core Swagger, OpenAPI, and AsyncAPI tooling. [Meet the team →](https://speclynx.com/about/)

<p align="left">
  <a href="https://speclynx.com/manifesto/"><img alt="Runs locally" src="https://img.shields.io/badge/Runs_locally-3A97CC?style=for-the-badge" /></a>
  <a href="https://speclynx.com/manifesto/"><img alt="Works offline" src="https://img.shields.io/badge/Works_offline-3A97CC?style=for-the-badge" /></a>
  <a href="https://speclynx.com/manifesto/"><img alt="No accounts" src="https://img.shields.io/badge/No_accounts-092B4E?style=for-the-badge" /></a>
  <a href="https://speclynx.com/manifesto/"><img alt="No telemetry" src="https://img.shields.io/badge/No_telemetry-092B4E?style=for-the-badge" /></a>
</p>

## What people say

<table>
<tr>
<td width="50%" valign="top">

Since my days at Apiary and Swagger, I've been looking for OpenAPI tooling I'd actually recommend. SpecLynx is it, and no wonder: it's built by many of the same people. The editor, CLI, and VS Code extension share one engine, so the whole toolchain just makes sense. I'll be using it in my consulting and training.

</td>
<td width="50%" valign="top">

When I started AsyncAPI, the hardest part wasn't the spec. It was the tooling around it: every standard got its own parser, validator and set of quirks. SpecLynx is the toolchain I wish had existed back then, with one consistent model across OpenAPI, AsyncAPI and Arazzo.

</td>
</tr>
<tr>
<td width="50%" valign="middle">

<a href="https://www.level250.com/"><img width="44" height="44" align="left" alt="Emmanuel Paraskakis" src="assets/testimonials/emmanuel-paraskakis.svg" /></a>
**Emmanuel Paraskakis**<br/>
<sub>Consultant, Trainer, Advisor · Founder, [Level 250](https://www.level250.com/)</sub>

</td>
<td width="50%" valign="middle">

<a href="https://usecommune.com/"><img width="44" height="44" align="left" alt="Fran Mendez" src="assets/testimonials/fran-mendez.svg" /></a>
**Fran Mendez**<br/>
<sub>AsyncAPI author · Building [usecommune.com](https://usecommune.com/)</sub>

</td>
</tr>
</table>

## Built in the open

SpecLynx is open source under Apache 2.0. Contributions and questions are welcome: star a repo, open an issue, or join the [Discussions](https://github.com/orgs/speclynx/discussions).

## Get help from the maintainers

SpecLynx is free to use. We help developers and teams integrate the tooling, standardize API and workflow specifications, and adopt it across their platform.

- **Website**: https://speclynx.com
- **Email**: info@speclynx.com

---

<div align="center">
  <sub><a href="https://speclynx.com/docs/">Docs</a> · <a href="https://speclynx.com/blog/">Blog</a> · <a href="https://speclynx.com/manifesto/">Manifesto</a> · <a href="https://www.linkedin.com/company/speclynx">LinkedIn</a> · <a href="mailto:info@speclynx.com">Contact</a></sub>
</div>
