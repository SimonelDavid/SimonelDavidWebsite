import Image from "next/image";
import Atmosphere from "@/components/Atmosphere";
import Nav from "@/components/Nav";
import Globe from "@/components/Globe";
import Lightbox from "@/components/Lightbox";
import { fetchLinkedInPosts } from "@/lib/linkedinFeed";

// Re-fetch at most every 4 hours when deployed to Vercel/Node hosts (ISR).
// Static-export builds (`output: 'export'`) ignore this - schedule a rebuild
// via GitHub Actions instead. See .github/workflows/rebuild.yml.
export const revalidate = 14400;

export default async function Page() {
  const { posts, source } = await fetchLinkedInPosts();
  // Surface the source in build logs so you can verify which path ran.
  // eslint-disable-next-line no-console
  console.log(`[page] LinkedIn posts source: ${source} (${posts.length} posts)`);
  return (
    <>
      <Atmosphere />
      <Nav />

      {/* ============ HERO ============ */}
      <section className="hero" id="top">
        <Globe canvasId="hero-canvas" scale={0.4} showLabels />
        <div className="hero-readability" />
        <div className="hero-grid" id="heroGrid" />
        <div className="hero-vignette" />

        <div className="hud hud-tl" aria-hidden="true">
          <div className="head"><span>NODE · EU-CENTRAL</span><span className="live">LIVE</span></div>
          <div className="row"><span>LAT</span><b>46.7712° N</b></div>
          <div className="row"><span>LON</span><b>23.6236° E</b></div>
          <div className="row"><span>SECTOR</span><b>CLOUD · EO</b></div>
          <div className="row"><span>UPTIME</span><span className="v">99.97%</span></div>
          <div className="bar"><i /></div>
        </div>

        <div className="hud hud-tr" aria-hidden="true">
          <div className="head"><span>PORTFOLIO · ACTIVE</span><span className="live">3/3</span></div>
          <div className="row"><span>ROSPIN</span><span className="v">BD DIR ↗</span></div>
          <div className="row"><span>COERA</span><span className="v">DEVOPS ↗</span></div>
          <div className="row"><span>AIM‑SPACE</span><span className="v">EO PM ↗</span></div>
          <div className="bar b2"><i /></div>
          <div className="bar b3"><i /></div>
        </div>

        <div className="hud hud-bl" aria-hidden="true">
          <div className="head"><span>NETWORK · MESH</span><span className="live">SYNC</span></div>
          <div className="row"><span>NODES</span><b>184</b></div>
          <div className="row"><span>ROUTES</span><b>21</b></div>
          <div className="row"><span>THROUGHPUT</span><span className="v" id="hudTput">12.4 GB/s</span></div>
          <div className="row"><span>STATUS</span><span className="v">◉ OPERATIONAL</span></div>
        </div>

        <div className="hero-inner">
          <div className="hero-top">
            <div className="location-pill"><span className="dot" /> Cluj-Napoca · Romania</div>
            <h1 className="display-name">
              Simonel<br />
              <span className="accent">David</span>
            </h1>
            <p className="hero-tagline">
              Business Development Director for <b>ROSPIN</b> · Building Romania&apos;s space economy.
            </p>
            <p className="hero-subline">
              DevOps engineer at COERA. EO Platform PM at AIM-SPACE. Connecting cloud infrastructure to orbital ambition.
            </p>
            <div className="cta-row">
              <a className="btn btn-primary magnetic" href="#contact">
                Get in touch <span className="arrow">→</span>
              </a>
              <a className="btn btn-ghost magnetic" href="/assets/Simonel-David-CV.pdf" download>
                Download CV <span className="arrow">↓</span>
              </a>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-meta" style={{ textAlign: "left" }}>
              <div><b>003</b> CONCURRENT TRACKS · APR 2026 - CURRENT</div>
              <div>BD DIR · DEVOPS · EO PM</div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <span>Scroll</span>
          <span className="scroll-line" />
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="marquee">
        <div className="marquee-track">
          <span><i>AWS</i> · cloud-native <em>infrastructure</em> · <i>Kubernetes</i> · scale &amp; reliability · <i>Sentinel-2</i> · earth observation · <i>SAR</i> · multispectral imagery · <i>Copernicus</i> · the future of space is built on cloud · <i>ROSPIN</i> · partnerships &amp; ecosystem · </span>
          <span aria-hidden="true"><i>AWS</i> · cloud-native <em>infrastructure</em> · <i>Kubernetes</i> · scale &amp; reliability · <i>Sentinel-2</i> · earth observation · <i>SAR</i> · multispectral imagery · <i>Copernicus</i> · the future of space is built on cloud · <i>ROSPIN</i> · partnerships &amp; ecosystem · </span>
        </div>
      </div>

      {/* ============ ORG LOGO STRIP ============ */}
      <aside className="orgs-strip reveal" aria-label="Organisations">
        <div className="orgs-label">Currently building at</div>
        <div className="orgs-row">
          <a className="org-logo" href="https://rospin.org" target="_blank" rel="noopener" aria-label="ROSPIN">
            <Image src="/logos/orgs/rospin.png" alt="ROSPIN" width={170} height={146} />
          </a>
          <a className="org-logo" href="https://coera.eu" target="_blank" rel="noopener" aria-label="COERA">
            <Image src="/logos/orgs/coera.png" alt="COERA" width={200} height={64} />
          </a>
          <a className="org-logo" href="https://aim-space.com" target="_blank" rel="noopener" aria-label="AIM-SPACE">
            <Image src="/logos/orgs/aimspace.png" alt="AIM-SPACE" width={188} height={101} />
          </a>
        </div>
      </aside>

      {/* ============ LANDSAT NAME ============ */}
      <section className="landsat-name reveal" aria-label="Name written in Landsat satellite imagery">
        <span className="eyebrow">- Coordinates / a name from orbit</span>
        <h2>My name, <em>spelled by Earth.</em></h2>
        <div className="credit">
          Rendered with NASA&apos;s{" "}
          <a href="https://science.nasa.gov/specials/your-name-in-landsat/" target="_blank" rel="noopener">
            Your Name in Landsat
          </a>{" "}
          · letterforms found in real Landsat satellite imagery
        </div>
        <div className="landsat-frame reveal-scale">
          <span className="landsat-corners tl">LANDSAT · EE</span>
          <span className="landsat-corners tr">SIMONEL</span>
          <span className="landsat-corners bl">PATH/ROW · 184/028</span>
          <span className="landsat-corners br">L8 · OLI</span>
          <Image
            src="/assets/landsat-name-simonel.png"
            alt="The name SIMONEL spelled out using Landsat satellite imagery of Earth's surface"
            width={2662}
            height={862}
            sizes="(max-width: 920px) 100vw, 920px"
            style={{ width: "100%", height: "auto" }}
            priority
          />
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="section" id="about">
        <div className="reveal">
          <span className="eyebrow">01 / About</span>
          <h2 className="section-title">Two industries.<br /><em>One operator.</em></h2>
        </div>

        <div className="about-grid">
          <div className="reveal-x">
            <div className="portrait-wrap" data-parallax="0.06">
              <div className="ring"><span className="sat" /></div>
              <div className="ring r2">
                <span className="sat" style={{ background: "var(--ivory)", boxShadow: "0 0 8px var(--ivory)" }} />
              </div>
              <div className="portrait">
                <Image
                  src="/assets/portrait-hero.jpg"
                  alt="Simonel David speaking at FAST conference"
                  width={420}
                  height={420}
                  sizes="420px"
                />
              </div>
              <div className="portrait-secondary" title="Outside the work - Bavaria">
                <Image
                  src="/assets/portrait-personal.jpg"
                  alt="Simonel at a Bavarian lake"
                  width={140}
                  height={140}
                />
              </div>
            </div>
          </div>

          <div className="about-body reveal-r">
            <p>
              I&apos;m a <strong>DevOps engineer</strong> with a foot firmly in the space industry. By day I build cloud-native infrastructure at <strong>COERA</strong> - AWS, Kubernetes, observability stacks designed for scale and reliability. By the second half of the day I lead the Earth Observation platform at <strong>AIM-SPACE</strong>, turning satellite imagery into products customers can actually use. And in the evenings, I help build the Romanian space ecosystem at <strong>ROSPIN</strong>, where I&apos;m now stepping in as Business Development Director.
            </p>
            <p>
              The pattern matters. Cloud infrastructure and Earth Observation aren&apos;t separate fields anymore - the future of space is increasingly built on cloud, and someone has to translate between those worlds. That&apos;s where I sit. My ROSPIN journey started years earlier, founding the community as its first Community Manager, launching ROSPIN School, building the Satellite Data Processing Masterclass with Babeș-Bolyai University. The Business Development Director role is a continuation, not a pivot.
            </p>
            <p>
              I hold a BSc in Computer Science from Babeș-Bolyai University and I&apos;m pursuing a Master&apos;s in Distributed Systems on the Internet there. Outside the work: violin and guitar, contemporary dance, third place at the National Astronomy &amp; Astrophysics Olympiad. I speak Romanian, English (C1), and intermediate German. I&apos;m based in Cluj-Napoca, and I&apos;m building from here.
            </p>

            <div className="pull-quote">&ldquo;The future of space is built on cloud.&rdquo;</div>

            <div className="about-stats">
              <div className="stat">
                <div className="num" data-count="3" data-suffix="">0</div>
                <div className="label">Concurrent Roles</div>
              </div>
              <div className="stat">
                <div className="num" data-count="11" data-suffix="">0</div>
                <div className="label">Cities · ROSPIN Events</div>
              </div>
              <div className="stat">
                <div className="num" data-count="300" data-suffix="+">0</div>
                <div className="label">Students · School Ed.1</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EARTH STRIP ============ */}
      <div className="earth-strip reveal-scale">
        <div className="earth-strip-inner">
          <div
            className="earth-img"
            data-parallax-y="0.18"
            style={{ backgroundImage: "url('/assets/earth-bluemarble.jpg')" }}
          />
          <h3>Pixels become <em>roadmaps.</em></h3>
          <div className="meta">
            <div><b>SOURCE</b> NASA · BLUE MARBLE</div>
            <div>SENTINEL-2 · SENTINEL-1 SAR</div>
            <div>COPERNICUS · GEE</div>
          </div>
        </div>
      </div>

      {/* ============ PILLARS ============ */}
      <section className="section" id="pillars">
        <div className="reveal">
          <span className="eyebrow">02 / Practice</span>
          <h2 className="section-title">What I do, <em>in three orbits.</em></h2>
        </div>

        <div className="pillars-grid">
          <article className="pillar reveal delay-1">
            <div className="photo">
              <Image src="/assets/event-rospin-ecosystem-tum.jpg" alt="" fill sizes="(max-width:980px) 100vw, 33vw" />
            </div>
            <div className="body">
              <div>
                <div className="num">- 01</div>
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
                  </svg>
                </div>
                <h3>Business Development &amp; <em>Ecosystem</em></h3>
                <p>Leading partnerships, strategy, and ecosystem growth at ROSPIN. Connecting Romanian space tech to European institutions, industry partners, and academic networks. Building the structures that turn interest in space into long-term engagement.</p>
              </div>
              <div className="tags">
                <span className="tag">ROSPIN</span><span className="tag">Partnerships</span><span className="tag">Ecosystem</span><span className="tag">Strategy</span>
              </div>
            </div>
          </article>

          <article className="pillar reveal delay-2">
            <div className="photo">
              <Image src="/assets/event-cncf-cluj.jpg" alt="" fill sizes="(max-width:980px) 100vw, 33vw" />
            </div>
            <div className="body">
              <div>
                <div className="num">- 02</div>
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <rect x="3" y="4" width="18" height="5" rx="1" />
                    <rect x="3" y="10.5" width="18" height="5" rx="1" />
                    <rect x="3" y="17" width="18" height="3" rx="1" />
                    <circle cx="6.5" cy="6.5" r=".7" fill="currentColor" />
                    <circle cx="6.5" cy="13" r=".7" fill="currentColor" />
                  </svg>
                </div>
                <h3>Cloud Infrastructure &amp; <em>DevOps</em></h3>
                <p>Cloud-native systems at COERA: AWS, Azure, Kubernetes, Terraform, Ansible, ArgoCD, observability with Prometheus + Thanos + Grafana. Scale, reliability, delivery - the infrastructure mindset that increasingly powers modern space missions.</p>
              </div>
              <div className="tags">
                <span className="tag">AWS</span><span className="tag">Kubernetes</span><span className="tag">Terraform</span><span className="tag">Observability</span>
              </div>
            </div>
          </article>

          <article className="pillar reveal delay-3">
            <div className="photo">
              <Image src="/assets/event-aim-space.jpg" alt="" fill sizes="(max-width:980px) 100vw, 33vw" />
            </div>
            <div className="body">
              <div>
                <div className="num">- 03</div>
                <div className="icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M3 12a9 9 0 0118 0M3 12a9 9 0 0018 0" strokeDasharray="2 2" />
                    <circle cx="12" cy="3" r="1.2" fill="currentColor" />
                  </svg>
                </div>
                <h3>Earth Observation <em>Product</em></h3>
                <p>Leading product strategy at AIM-SPACE for an EO platform. Working with Sentinel-2, Sentinel-1 SAR, Copernicus pipelines, Google Earth Engine. Translating satellite data capability into customer-facing products and roadmaps.</p>
              </div>
              <div className="tags">
                <span className="tag">Sentinel-1/2</span><span className="tag">Copernicus</span><span className="tag">SAR</span><span className="tag">GEE</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ============ EARTH GALLERY ============ */}
      <section className="section" id="earth">
        <div className="reveal">
          <span className="eyebrow">- Imagery / Earth from above</span>
          <h2 className="section-title">The view <em>from orbit.</em></h2>
          <p style={{ marginTop: 18, maxWidth: "60ch", fontFamily: "var(--f-body)", fontWeight: 300, color: "var(--ivory-dim)", lineHeight: 1.7 }}>
            Public-domain Earth observation imagery. The medium I work with daily - and the reason cloud infrastructure matters more every year.
          </p>
        </div>

        <div className="earth-gallery">
          <div className="ec size-a reveal-scale">
            <Image src="/assets/earth-bluemarble.jpg" alt="Earth from Apollo 17 - the Blue Marble" fill sizes="(max-width:900px) 100vw, 60vw" />
            <div className="cap"><b>Blue Marble · Apollo 17</b>The reference frame</div>
          </div>
          <div className="ec size-b reveal-scale delay-1">
            <Image src="/assets/earth-night.jpg" alt="Earth at night from low orbit" fill sizes="(max-width:900px) 100vw, 40vw" />
            <div className="cap"><b>Earth at Night · ISS</b>Cities as light · infrastructure as glow</div>
          </div>
          <div className="ec size-c reveal">
            <Image src="/assets/event-aim-space.jpg" alt="AIM-SPACE EO platform work" fill sizes="(max-width:900px) 100vw, 33vw" />
            <div className="cap"><b>AIM-SPACE · FAST 2026</b>Pixels into product</div>
          </div>
          <div className="ec size-d reveal delay-1">
            <Image src="/assets/event-rospin-ecosystem-tum.jpg" alt="ROSPIN at TUM" fill sizes="(max-width:900px) 100vw, 33vw" />
            <div className="cap"><b>ROSPIN · TUM Munich</b>The continent we work in</div>
          </div>
          <div className="ec size-e reveal delay-2">
            <Image src="/assets/event-cncf-cluj.jpg" alt="CNCF Cluj-Napoca speaking" fill sizes="(max-width:900px) 100vw, 33vw" />
            <div className="cap"><b>CNCF · Cluj-Napoca</b>Cloud-native, from the ground up</div>
          </div>
        </div>
      </section>

      {/* ============ TIMELINE ============ */}
      <section className="section" id="timeline">
        <div className="reveal">
          <span className="eyebrow">03 / Trajectory</span>
          <h2 className="section-title">An orbit, <em>not a ladder.</em></h2>
        </div>

        <div className="tl-wrap" id="tlWrap">
          <div className="tl-section-label">Current orbit</div>

          <div className="tl-item current">
            <span className="tl-node" />
            <div className="photo-thumb"><Image src="/assets/event-rospin-ecosystem-tum.jpg" alt="" width={108} height={108} /></div>
            <div className="tl-meta"><span className="pulse" /> Apr 2026 - Present · <span className="role-org"><span className="role-logo tall"><Image src="/logos/orgs/rospin.png" alt="" width={28} height={24} /></span><span className="sr-only">ROSPIN</span></span></div>
            <h4>Business Development Director</h4>
            <p className="desc">Leading the organisation&apos;s growth strategy and partnerships. Translating Romania&apos;s space ambition into structured engagement with European institutions, industry partners, and universities. The role is a continuation of work that began as Community Manager four years ago.</p>
          </div>

          <div className="tl-item current">
            <span className="tl-node" />
            <div className="photo-thumb"><Image src="/assets/cluj-startups-mentor.jpg" alt="" width={108} height={108} /></div>
            <div className="tl-meta"><span className="pulse" /> Apr 2026 - Present · <span className="role-org"><span className="role-logo"><Image src="/logos/orgs/clujstartups.png" alt="" width={91} height={18} /></span><span className="sr-only">Cluj Startups</span></span></div>
            <h4>Mentor · Cluj Startups Ecosystem</h4>
            <p className="desc">Mentoring early-stage founders in the Cluj-Napoca startup community - product, cloud architecture, and the hard parts of going from prototype to production.</p>
          </div>

          <div className="tl-item current">
            <span className="tl-node" />
            <div className="photo-thumb"><Image src="/assets/event-cncf-cluj.jpg" alt="" width={108} height={108} /></div>
            <div className="tl-meta"><span className="pulse" /> Jan 2026 - Present · <span className="role-org"><span className="role-logo"><Image src="/logos/orgs/coera.png" alt="" width={56} height={18} /></span><span className="sr-only">COERA BC SRL</span></span></div>
            <h4>Mid DevOps Engineer</h4>
            <p className="desc">Cloud-native infrastructure for production-scale systems. Kubernetes operations, AWS &amp; Azure, Terraform, ArgoCD, Prometheus + Thanos + Grafana observability stacks. Speaker at CNCF Cluj-Napoca on Kubernetes autoscaling with Karpenter.</p>

            <details className="tl-cluster">
              <summary>The COERA climb · Intern → Mid in 4 years <span className="arrow">▾</span></summary>
              <div className="climb">
                <div className="step"><span className="when">Jul 2022 - Aug 2022</span><span className="what">DevOps <em>Intern</em></span></div>
                <div className="step"><span className="when">Oct 2022 - Jun 2024</span><span className="what">Trainee DevOps Engineer</span></div>
                <div className="step"><span className="when">Jun 2024 - Jul 2025</span><span className="what">Junior DevOps Engineer</span></div>
                <div className="step"><span className="when">Jul 2025 - Jan 2026</span><span className="what">Advanced Junior DevOps Engineer</span></div>
                <div className="step"><span className="when">Jan 2026 - Present</span><span className="what"><em>Mid</em> DevOps Engineer</span></div>
              </div>
            </details>
          </div>

          <div className="tl-item current">
            <span className="tl-node" />
            <div className="photo-thumb"><Image src="/assets/event-aim-space.jpg" alt="" width={108} height={108} /></div>
            <div className="tl-meta"><span className="pulse" /> Nov 2025 - Present · <span className="role-org"><span className="role-logo"><Image src="/logos/orgs/aimspace.png" alt="" width={34} height={18} /></span><span className="sr-only">AIM-SPACE</span></span></div>
            <h4>EO Platform Product Manager</h4>
            <p className="desc">Leading product strategy for an Earth Observation platform - Sentinel-2 optical, Sentinel-1 SAR, Copernicus pipelines, Google Earth Engine. Translating satellite-data capability into customer-facing products and roadmap.</p>
          </div>

          <div className="tl-item current">
            <span className="tl-node" />
            <div className="photo-thumb"><Image src="/assets/event-masterclass-ubb.jpg" alt="" width={108} height={108} /></div>
            <div className="tl-meta"><span className="pulse" /> Oct 2024 - Present · <span className="role-org">
              <span className="role-logo tall"><Image src="/logos/orgs/rospin.png" alt="" width={28} height={24} /></span>
              <span className="role-divider">×</span>
              <span className="role-logo"><Image src="/logos/orgs/ubb.png" alt="" width={59} height={18} /></span>
              <span className="sr-only">ROSPIN × Babeș-Bolyai University</span>
            </span></div>
            <h4>Satellite Data Processing Masterclass · Project Manager</h4>
            <p className="desc">Built and continues to run the program in partnership with Babeș-Bolyai University: a semester-long course teaching Sentinel-2, Copernicus, and Google Earth Engine to undergraduates.</p>
          </div>

          <div className="tl-item current">
            <span className="tl-node" />
            <div className="tl-meta"><span className="pulse" /> Sep 2022 - Present · <span className="role-org"><span className="role-logo tall"><Image src="/logos/orgs/rospin.png" alt="" width={28} height={24} /></span><span className="sr-only">ROSPIN</span></span></div>
            <h4>IT Manager</h4>
            <p className="desc">Manages rospin.org infrastructure; mentors junior developers across WordPress, cPanel, and React.</p>
          </div>

          <div className="tl-section-label">Recognition along the way</div>

          <div className="recog-photos reveal">
            <figure className="recog-photo">
              <Image src="/assets/event-ssea-munich.jpg" alt="SSEA Symposium 2026 Munich" width={220} height={150} />
              <figcaption><b>Apr 2026 · Munich</b>SSEA Symposium</figcaption>
            </figure>
            <figure className="recog-photo">
              <Image src="/assets/event-edt-sibiu.jpg" alt="EDT Conference 2026 Sibiu" width={220} height={150} />
              <figcaption><b>Mar 2026 · Sibiu</b>EDT Conference</figcaption>
            </figure>
            <figure className="recog-photo">
              <Image src="/assets/event-defense-x-presentation.jpg" alt="Defense-X 2025 Sibiu" width={220} height={150} />
              <figcaption><b>Dec 2025 · Sibiu</b>Defense-X Winner</figcaption>
            </figure>
            <figure className="recog-photo">
              <Image src="/assets/event-ariel-hackathon-madrid.jpg" alt="ESA Ariel Hackathon Madrid" width={220} height={150} />
              <figcaption><b>Jan 2025 · Madrid</b>ESA Ariel Hackathon</figcaption>
            </figure>
            <figure className="recog-photo">
              <Image src="/assets/event-bachelors-thesis.jpg" alt="Bachelor's thesis" width={220} height={150} />
              <figcaption><b>Sep 2024</b>Bachelor&apos;s thesis</figcaption>
            </figure>
          </div>

          <div className="tl-item recog"><span className="tl-node" /><div className="tl-meta">Apr 2026 · Munich</div><h4>Speaker · 5th SSEA Symposium - presented the ROSPIN Satellite Data Processing Masterclass</h4></div>
          <div className="tl-item recog"><span className="tl-node" /><div className="tl-meta">Mar 2026 · Sibiu</div><h4>Speaker · 5th EDT Conference - Federated Learning for On-Orbit EO Analytics in Military Satellite Constellations</h4></div>
          <div className="tl-item recog"><span className="tl-node" /><div className="tl-meta">Dec 2025 · Sibiu</div><h4>Defense-X Hackathon · Winner - co-developed EOSec, multispectral + SAR monitoring for critical infrastructure</h4></div>
          <div className="tl-item recog"><span className="tl-node" /><div className="tl-meta">Jan 2025 · Madrid</div><h4>ESA Datalabs · Ariel Hackathon - ML for instrument noise analysis on the ESA Ariel exoplanet mission</h4></div>
          <div className="tl-item recog"><span className="tl-node" /><div className="tl-meta">Nov 2024</div><h4>Published · Top Cities in Romania by Urban Heat Island Hotspots &amp; Cold Spots (2018-2022)</h4></div>
          <div className="tl-item recog"><span className="tl-node" /><div className="tl-meta">Sep 2024</div><h4>Bachelor&apos;s thesis · Heat Islands App - UHI analysis for Romanian cities (AIM-SPACE)</h4></div>
          <div className="tl-item recog"><span className="tl-node" /><div className="tl-meta">2018, 2019 · Vilnius, Antalya</div><h4>Erasmus+ programs - &ldquo;Synergy for Renewal&rdquo; &amp; &ldquo;Be Unique&rdquo;</h4></div>
          <div className="tl-item recog"><span className="tl-node" /><div className="tl-meta">2020 · Romania</div><h4>3rd place · National Astronomy &amp; Astrophysics Olympiad</h4></div>

          <div className="tl-section-label">Past trajectory</div>

          <div className="tl-item">
            <span className="tl-node" />
            <div className="tl-meta">Mar 2023 - Nov 2025 · <span className="role-org"><span className="role-logo"><Image src="/logos/orgs/aimspace.png" alt="" width={34} height={18} /></span><span className="sr-only">AIM-SPACE</span></span></div>
            <h4>Software Engineer</h4>
            <p className="desc">Satellite data processing and geospatial analysis. Promoted internally to EO Platform PM.</p>
          </div>
          <div className="tl-item">
            <span className="tl-node" />
            <div className="tl-meta">Apr 2024 - Dec 2024 · <span className="role-org"><span className="role-logo tall"><Image src="/logos/orgs/rsf.png" alt="" width={44} height={22} /></span><span className="sr-only">Romanian Science Festival</span></span></div>
            <h4>PR Coordinator &amp; Aerospace Mentor</h4>
          </div>
          <div className="tl-item">
            <span className="tl-node" />
            <div className="tl-meta">Sep 2022 - Jan 2024 · <span className="role-org"><span className="role-logo tall"><Image src="/logos/orgs/rospin.png" alt="" width={28} height={24} /></span><span className="sr-only">ROSPIN</span></span></div>
            <h4>Community Manager</h4>
            <p className="desc">Organised large-scale space-education events across 11 cities in Romania.</p>
          </div>
          <div className="tl-item">
            <span className="tl-node" />
            <div className="tl-meta">Jan 2022 - Sep 2022 · <span className="role-org"><span className="role-logo tall"><Image src="/logos/orgs/rospin.png" alt="" width={28} height={24} /></span><span className="sr-only">ROSPIN</span></span></div>
            <h4>ROSPIN School · Project Manager (Founder)</h4>
            <p className="desc">Founded the program; inaugural edition reached 300+ high-school participants.</p>
          </div>
          <div className="tl-item">
            <span className="tl-node" />
            <div className="tl-meta">Oct 2021 - Sep 2022 · <span className="role-org"><span className="role-logo tall"><Image src="/logos/orgs/rospin.png" alt="" width={28} height={24} /></span><span className="sr-only">ROSPIN</span></span></div>
            <h4>Cluj-Napoca Ambassador</h4>
          </div>

          <div className="tl-section-label">Education</div>

          <div className="tl-item">
            <span className="tl-node" />
            <div className="tl-meta">In progress · <span className="role-org"><span className="role-logo"><Image src="/logos/orgs/ubb.png" alt="" width={59} height={18} /></span><span className="sr-only">Babeș-Bolyai University</span></span></div>
            <h4>Master&apos;s · Distributed Systems on the Internet</h4>
          </div>
          <div className="tl-item">
            <span className="tl-node" />
            <div className="tl-meta">2021 - 2024 · <span className="role-org"><span className="role-logo"><Image src="/logos/orgs/ubb.png" alt="" width={59} height={18} /></span><span className="sr-only">Babeș-Bolyai University</span></span></div>
            <h4>BSc · Computer Science</h4>
          </div>
          <div className="tl-item">
            <span className="tl-node" />
            <div className="tl-meta">2021 - 2022 · <span className="role-org"><span className="role-logo tall"><Image src="/logos/orgs/rospin.png" alt="" width={28} height={24} /></span><span className="sr-only">ROSPIN</span></span></div>
            <h4>ROSPIN Academy · Level 1 &amp; Level 2</h4>
          </div>
        </div>
      </section>

      {/* ============ FROM LINKEDIN ============ */}
      <section className="section" id="linkedin">
        <div className="reveal">
          <span className="eyebrow">04 / On LinkedIn</span>
          <h2 className="section-title">Recent <em>posts.</em></h2>
          <p style={{ marginTop: 18, maxWidth: "60ch", fontFamily: "var(--f-body)", fontWeight: 300, color: "var(--ivory-dim)", lineHeight: 1.7 }}>
            The latest from{" "}
            <a href="https://www.linkedin.com/in/simoneldavid/" target="_blank" rel="noopener" style={{ color: "var(--gold-warm)", borderBottom: "1px solid rgba(212,175,55,.4)" }}>
              /in/simoneldavid
            </a>
            . Auto-refreshed at every build {source === "live" ? "from the live feed" : "(showing curated examples; live feed not yet connected)"}.
          </p>
        </div>

        <div className="hl-grid">
          {posts.map((p, i) => {
            const sizeClass = `size-${p.size}`;
            const delay = i % 3 === 1 ? "delay-1" : i % 3 === 2 ? "delay-2" : "";
            return (
              <a
                key={i}
                className={`hl-card ${sizeClass} reveal ${delay}`.trim()}
                href={p.url}
                target="_blank"
                rel="noopener"
              >
                <div className="thumb">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(max-width:900px) 100vw, 50vw"
                      // LinkedIn CDN images are short-lined; skip Next's optimizer
                      // so static-export builds work without extra config.
                      unoptimized={p.image.startsWith("http")}
                    />
                  ) : (
                    /* Posts without media get a styled LinkedIn-themed placeholder. */
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src="/assets/linkedin-placeholder.svg"
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </div>
                <div className="body">
                  <div className="date">{p.date}</div>
                  <h4>{p.title}</h4>
                  <p>{p.body}</p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="ig-cta reveal delay-2">
          Follow on LinkedIn ·{" "}
          <a href="https://www.linkedin.com/in/simoneldavid/" target="_blank" rel="noopener">
            /in/simoneldavid
          </a>
        </div>
      </section>

      {/* ============ PROJECTS ============ */}
      <section className="section" id="projects">
        <div className="reveal">
          <span className="eyebrow">05 / Selected work</span>
          <h2 className="section-title">Things <em>built &amp; shipped.</em></h2>
        </div>

        <div className="proj-rail reveal delay-1">
          <article className="proj-card featured" data-video="pY-WMo3AQpY">
            <div className="proj-thumb">
              <span className="proj-tag gold">Hackathon · Winner · ROSPIN team</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.ytimg.com/vi/pY-WMo3AQpY/maxresdefault.jpg"
                alt="EOSec demo thumbnail"
              />
              <button className="play-btn" aria-label="Play EOSec demo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            <div className="proj-body">
              <div className="year">Dec 2025 · Defense-X · Sibiu</div>
              <h4>EOSec</h4>
              <p className="tagline">Satellite-based monitoring platform using multispectral and SAR imagery to detect critical-infrastructure and border-change events.</p>
            </div>
          </article>

          <article className="proj-card" data-video="w-RFa4omcPA">
            <div className="proj-thumb">
              <span className="proj-tag gold">Bachelor&apos;s thesis · Earth Observation · Production</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.ytimg.com/vi/w-RFa4omcPA/maxresdefault.jpg"
                alt="Heat Islands App thumbnail"
              />
              <button className="play-btn" aria-label="Play Heat Islands demo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            <div className="proj-body">
              <div className="year">2024 · AIM-SPACE</div>
              <h4>Heat Islands App</h4>
              <p className="tagline">Urban Heat Island analysis platform for Romanian cities - the genesis of the AIM-SPACE work and ongoing UHI research (Romania v3 dataset).</p>
            </div>
          </article>

          <article className="proj-card">
            <div className="proj-thumb">
              <span className="proj-tag">Education · Active program</span>
              <div className="ph">SAT-DATA · MASTERCLASS · UBB</div>
            </div>
            <div className="proj-body">
              <div className="year">2024 - Present · ROSPIN × UBB</div>
              <h4>Satellite Data Processing Masterclass</h4>
              <p className="tagline">A semester-long course teaching students to work with Sentinel-2, Copernicus, and Google Earth Engine - built and managed in partnership with Babeș-Bolyai University.</p>
            </div>
          </article>

          <article className="proj-card">
            <div className="proj-thumb">
              <span className="proj-tag">Education · Founded</span>
              <div className="ph">ROSPIN SCHOOL · ED.01</div>
            </div>
            <div className="proj-body">
              <div className="year">2022 · ROSPIN</div>
              <h4>ROSPIN School</h4>
              <p className="tagline">Founded and managed the inaugural edition. 300+ high-school participants across Romania exposed to space science and engineering.</p>
            </div>
          </article>

          <article className="proj-card" data-video="QGez41qlVDQ">
            <div className="proj-thumb">
              <span className="proj-tag">Indie game · Godot · 2021</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.ytimg.com/vi/QGez41qlVDQ/maxresdefault.jpg"
                alt="Wandering for Freedom thumbnail"
              />
              <button className="play-btn" aria-label="Play Wandering for Freedom trailer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            <div className="proj-body">
              <div className="year">2021 · itch.io · Google Play</div>
              <h4>Wandering for Freedom</h4>
              <p className="tagline">A 2D narrative game built in Godot, inspired by John Stuart Mill&apos;s <em>On Liberty</em>. First complete published project - started here, now leading EO platforms.</p>
            </div>
          </article>
        </div>

        <div className="exploring reveal">
          <b>Currently exploring:</b> federated learning for on-orbit Earth Observation analytics.
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section className="section contact" id="contact">
        <Globe canvasId="contact-canvas" scale={0.36} showLabels={false} />
        <div className="contact-inner">
          <div className="reveal">
            <span className="eyebrow">06 / Contact</span>
            <h2>Let&apos;s build the <em>future of Romanian space.</em></h2>
          </div>

          <div className="contact-grid">
            <div className="contact-info reveal delay-1">
              <div className="contact-row">
                <span className="lbl">Email</span>
                <span className="val"><a href="mailto:simonel.david@rospin.org">simonel.david@rospin.org</a></span>
              </div>
              <div className="contact-row">
                <span className="lbl">Phone</span>
                <span className="val"><a href="tel:+40734989230">(+40) 734 989 230</a></span>
              </div>
              <div className="contact-row">
                <span className="lbl">Located</span>
                <span className="val">Cluj-Napoca · Cluj County · Romania</span>
              </div>
              <div className="contact-row">
                <span className="lbl">Languages</span>
                <span className="val" style={{ fontSize: 18, fontFamily: "var(--f-body)", fontWeight: 300, color: "var(--ivory-dim)", paddingTop: 8 }}>
                  Romanian (native) · English (C1) · German (intermediate)
                </span>
              </div>
              <div className="contact-row">
                <span className="lbl">Availability</span>
                <span className="val" style={{ fontSize: 18, fontFamily: "var(--f-body)", fontWeight: 300, color: "var(--ivory-dim)", paddingTop: 8 }}>
                  Open to partnerships, speaking, and aligned collaborations.
                </span>
              </div>
            </div>

            <div className="contact-socials reveal delay-2">
              <a className="social-card primary" href="https://www.linkedin.com/in/simoneldavid/" target="_blank" rel="noopener">
                <div>
                  <div className="name">LinkedIn</div>
                  <div className="handle">/in/simoneldavid</div>
                </div>
                <span className="arr">↗</span>
              </a>
              <a className="social-card primary" href="https://www.instagram.com/david.simonel_7/" target="_blank" rel="noopener">
                <div>
                  <div className="name">Instagram</div>
                  <div className="handle">@david.simonel_7</div>
                </div>
                <span className="arr">↗</span>
              </a>
              <a className="social-card tiny" href="https://github.com/simoneldavid" target="_blank" rel="noopener">
                <div>
                  <div className="name">GitHub</div>
                  <div className="handle">technical depth · the playful sibling</div>
                </div>
                <span className="arr">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="name">© 2026 · Simonel-Olimpiu David</div>
        <div className="links">
          <a href="https://www.linkedin.com/in/simoneldavid/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://www.instagram.com/david.simonel_7/" target="_blank" rel="noopener">Instagram</a>
          <a href="https://github.com/simoneldavid" target="_blank" rel="noopener">GitHub</a>
          <a className="dim" href="https://x.com/SimonelDavid" target="_blank" rel="noopener">X</a>
          <a href="mailto:simonel.david@rospin.org">Email</a>
        </div>
        <div>Made with care in Cluj-Napoca</div>
      </footer>

      <Lightbox />
    </>
  );
}
