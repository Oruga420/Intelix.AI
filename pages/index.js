import Head from "next/head";
import { useEffect, useRef } from "react";

function WebGLEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertSrc = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragSrc = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_res;
      float wave(vec2 p, float t) {
        return 0.04 * sin(p.x * 4.0 + t) + 0.04 * cos(p.y * 3.0 - t * 1.4);
      }
      void main() {
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        float t = u_time * 0.5;
        float wobble = wave(uv, t) + wave(uv.yx, t * 0.8);
        vec3 col = mix(vec3(0.97, 0.98, 1.0), vec3(0.15, 0.46, 0.91), uv.y + wobble * 6.0);
        col += 0.05 * sin(8.0 * (uv.x + uv.y + wobble + t));
        gl_FragColor = vec4(col, 0.75);
      }
    `;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vert = compile(gl.VERTEX_SHADER, vertSrc);
    const frag = compile(gl.FRAGMENT_SHADER, fragSrc);
    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_res");

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(resLoc, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };

    resize();
    window.addEventListener("resize", resize);

    let frame;
    const render = (time) => {
      resize();
      gl.uniform1f(timeLoc, time * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="webgl-canvas"
      role="presentation"
      aria-hidden="true"
    />
  );
}

export default function Home() {
  const handleDownloadPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <>
      <Head>
        <title>Alejandro De La Mora | AI Solutions Architect</title>
        <meta
          name="description"
          content="AI Solutions Architect and Salesforce Developer resume for Alejandro De La Mora."
        />
      </Head>
      <main className="page">
        <WebGLEffect />
        <div className="header">
          <div className="hero-panel">
            <h1 className="name">Alejandro De La Mora</h1>
            <p className="role">AI Solutions Architect | Salesforce Developer</p>
            <p className="summary">
              AI Solutions Architect with extensive experience designing and
              deploying over 120 productive GenAI applications and agentic
              workflows. Proven track record in regulated industries (Supply
              Chain Compliance), driving AI adoption from 47% to 97% and
              achieving over $1M in operational savings through automation.
              Expert in bridging the gap between complex data architectures
              (RAG, MCP) and business outcomes using GCP, AWS, Vercel, and
              Salesforce.
            </p>
            <div className="actions">
              <button className="button" onClick={handleDownloadPdf}>
                Download as PDF
              </button>
            </div>
          </div>
          <div className="contact-card">
            <h3 className="contact-title">Contact</h3>
            <a className="contact-item" href="tel:+14372433693">
              +1 437 243 3693
            </a>
            <a className="contact-item" href="mailto:alex@seshwithfriends.org">
              alex@seshwithfriends.org
            </a>
            <a
              className="contact-item"
              href="https://www.linkedin.com/in/amorac/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="contact-item"
              href="http://www.eloruga.com"
              target="_blank"
              rel="noreferrer"
            >
              Website
            </a>
            <a
              className="contact-item"
              href="https://github.com/Oruga420"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="chips">
          {[
            "GenAI Architecture",
            "Agentic Workflows",
            "RAG",
            "GraphRAG concepts",
            "LLM Integration",
            "GCP",
            "AWS",
            "Vercel",
            "Salesforce",
            "Zapier",
            "MCP Tools",
            "English",
            "Spanish",
          ].map((chip) => (
            <span className="chip" key={chip}>
              {chip}
            </span>
          ))}
        </div>

        <section className="section">
          <h2>Work Experience</h2>
          <article className="experience-card">
            <h3>Assent — AI Solutions Architect</h3>
            <div className="meta">
              <span>Canada</span>
              <span>Feb 2025 - Present</span>
            </div>
            <ul className="bullets">
              <li>
                Architected and deployed safe, auditable GenAI systems within a
                regulated compliance platform using live RAG connections and
                agentic workflows.
              </li>
              <li>
                Achieved over 20,000 man-hours saved (approx. $1M USD savings)
                within a single year via custom MCP servers and automations.
              </li>
              <li>
                Drove internal AI adoption from 47% to 97% with governance
                documentation that enables production-ready launches.
              </li>
            </ul>
          </article>

          <article className="experience-card">
            <h3>Sesh | Ai Solutions — AI Solutions Architect</h3>
            <div className="meta">
              <span>Toronto, Ontario</span>
              <span>Nov 2021 - Present</span>
            </div>
            <ul className="bullets">
              <li>
                Designed architecture for over 120 GenAI applications currently
                in productive stages across 30+ clients.
              </li>
              <li>
                Built 90+ chatbots utilizing RAG and automation backends to
                solve specific day-to-day business problems.
              </li>
              <li>
                Leads a 100+ person community, delivering webinars and tutorials
                to help professionals apply AI tech to daily tasks.
              </li>
            </ul>
          </article>

          <article className="experience-card">
            <h3>Online Business Systems — Salesforce Consultant</h3>
            <div className="meta">
              <span>Toronto, Ontario</span>
              <span>Jun 2024 - Nov 2024</span>
            </div>
            <ul className="bullets">
              <li>
                Configured AI assistants and Copilot-style experiences with
                secure data access and tailored prompts/actions.
              </li>
              <li>
                Delivered end-to-end setups for Marketing Cloud Account
                Engagement to align sales and marketing data models.
              </li>
            </ul>
          </article>

          <article className="experience-card">
            <h3>Globalization Partners — Salesforce Manager & GenAI Lead</h3>
            <div className="meta">
              <span>Ontario, Canada</span>
              <span>Nov 2018 - Nov 2023</span>
            </div>
            <ul className="bullets">
              <li>
                Managed a large Salesforce org with 1,000+ licenses, overseeing
                data models, security, and integrations.
              </li>
              <li>
                Pioneered the internal &quot;GIA&quot; chatbot and GenAI-powered
                workflows for Jira ticket handling.
              </li>
            </ul>
          </article>

          <article className="experience-card">
            <h3>Amstar DMC — Project Manager</h3>
            <div className="meta">
              <span>Guadalajara, Mexico</span>
              <span>May 2016 - Nov 2018</span>
            </div>
            <ul className="bullets">
              <li>
                Managed complex web and integration projects with budgets up to
                $700k USD and teams of up to 18 people.
              </li>
            </ul>
          </article>
        </section>

        <section className="section">
          <h2>Education & Certifications</h2>
          <div className="edu-grid">
            <div className="edu-card">
              <h3>Ingenieria en Sistemas (Systems Engineering)</h3>
              <p className="edu-meta">Universidad Marista de MAcrida (2007)</p>
              <p className="tagline">Certifications: Salesforce Certified AI Associate, Salesforce Certified Administrator (SCA).</p>
            </div>
            <div className="edu-card">
              <h3>Community & Open Source</h3>
              <p className="edu-meta">Sesh Community | GitHub Projects</p>
              <p className="tagline">
                Founder of a 100+ person GenAI community offering free classes;
                maintainer of GenAI automation repositories on GitHub.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
