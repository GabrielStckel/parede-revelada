// TODO: texto real da empresa
import equipeImg from "@/assets/equipe-stckel.jpg";
import { Logo } from "./Logo";

export function SobreStckel() {
  return (
    <section
      id="sobre"
      className="section-y"
      style={{ backgroundColor: "var(--color-breu)" }}
    >
      <div className="container-stckel sobre-grid">
        <figure className="sobre-foto">
          <img
            src={equipeImg}
            alt="Equipe Stckel Pinturas em obra"
            width={1600}
            height={1200}
            loading="lazy"
          />
          <span className="sobre-foto-tint" aria-hidden="true" />
        </figure>

        <div className="sobre-texto">
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              letterSpacing: "0.16em",
              color: "var(--color-grafite)",
              textTransform: "uppercase",
              margin: 0,
              marginBottom: 16,
            }}
          >
            A STCKEL
          </p>
          <h2
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
              A Stckel Pinturas nasceu em Curitiba do trabalho de campo — obra,
              andaime e prazo. Duas décadas depois, seguimos aplicando o mesmo
              princípio: o acabamento é decidido no preparo, não na demão final.
            </p>
            <p>
              Atendemos residências, condomínios e obras comerciais na região
              metropolitana com equipe própria, registrada e treinada em cada
              sistema que aplicamos. Sem terceirizar responsabilidade, sem
              improviso de material.
            </p>
            <p>
              O que entregamos é o que assinamos: fachada limpa, ambiente
              protegido e prazo cumprido. É por isso que a maior parte das obras
              chega até nós por indicação de quem já foi cliente.
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
