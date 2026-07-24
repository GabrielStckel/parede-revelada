// TODO: texto real da empresa
import equipeImg from "@/assets/equipe-stckel-1400.webp";
import { Logo } from "./Logo";

export function SobreStckel() {
  return (
    <section
      id="a-stckel"
      aria-labelledby="titulo-sobre"
      className="section-y"
      style={{ backgroundColor: "var(--color-breu)" }}
    >
      <div className="container-stckel sobre-grid">
        <figure className="sobre-foto">
          <img
            src={equipeImg}
            alt="Equipe Stckel Pinturas em obra"
            width={1400}
            height={1050}
            loading="lazy"
            decoding="async"
          />
          <span className="sobre-foto-tint" aria-hidden="true" />
        </figure>

        <div className="sobre-texto">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.16em",
              color: "var(--color-grafite-strong)",
              textTransform: "uppercase",
              margin: 0,
              marginBottom: 16,
            }}
          >
            A STCKEL
          </p>
          <h2
            id="titulo-sobre"
            style={{
              color: "var(--color-cal)",
              maxWidth: "16ch",
              margin: 0,
              marginBottom: "clamp(24px, 3vw, 40px)",
            }}
          >
            OFÍCIO QUE SE VÊ NA PAREDE
          </h2>

          <div className="sobre-paragrafos">
            <p>
              Pintor em Curitiba desde 2000, a Stckel nasceu do trabalho de
              campo — obra, andaime e prazo. Duas décadas depois, seguimos
              aplicando o mesmo princípio: o acabamento é decidido no preparo,
              não na demão final.
            </p>
            <p>
              Atendemos residências, condomínios e obras comerciais na região
              metropolitana com equipe própria, registrada e treinada em cada
              sistema que aplicamos. Sem terceirizar responsabilidade, sem
              improviso de material.
            </p>
          </div>

          <div className="sobre-assinatura">
            <Logo height={24} />
            <span className="sobre-assinatura-linha">
              CURITIBA · PR · DESDE 2000
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
