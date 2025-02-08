import styles from './BlogPost.module.css';

type BlogPostProps = {
  children?: any;
};

export default function BlogPost(props: BlogPostProps) {
  return (
    <article class={styles.blogPost}>
      <h1 class={styles.title}>Designing the Perfect Calendar</h1>
      <div class={styles.metadata}>February 7, 2025 • 8 min read</div>
      <div class={styles.content}>
        <p>
          In the realm of digital design, simplicity often proves to be the most sophisticated approach. 
          This philosophy guided our journey in creating a calendar that not only serves its primary function 
          but also stands as a piece of digital art. Inspired by the modernist principles of Wim Crouwel, 
          we sought to create a calendar that embodies both functionality and aesthetic beauty.
        </p>

        <h2>The Grid System</h2>
        <p>
          At the heart of our design lies a meticulously crafted grid system. Each column is precisely 
          calculated to create a harmonious visual rhythm, while maintaining perfect alignment with the 
          typographic elements above. The result is a calendar that feels both structured and organic, 
          with each element playing its part in the larger composition.
        </p>

        <h2>Typography Choices</h2>
        <p>
          The selection of Plus Jakarta Sans as our primary typeface was deliberate. Its geometric 
          construction and clean lines echo the modernist sensibilities that inspired this project, 
          while its contemporary details ensure the design feels current and fresh. The interplay 
          between the bold display of the month name and the subtle weight of the dates creates a 
          clear visual hierarchy that guides the user's eye.
        </p>

        <h3>Visual Hierarchy</h3>
        <p>
          Every element in the calendar has been carefully considered. The large-scale typography of 
          the month name serves as both a functional identifier and a striking visual element. The 
          dates below maintain a quieter presence while remaining perfectly legible, creating a 
          balanced composition that's both beautiful and useful.
        </p>

        <p>
          The transparent background and subtle hover effects add a layer of interactivity that makes 
          the calendar feel alive and responsive, while the consistent grid lines provide structure 
          and orientation. This delicate balance between static and dynamic elements creates an 
          experience that's both engaging and intuitive.
        </p>

        {props.children}
      </div>
    </article>
  );
}
