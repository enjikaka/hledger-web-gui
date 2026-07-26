// CSS-importer med ?inline (Vite/Rolldown) returnerar filinnehållet som sträng
declare module "*.css?inline" {
  const css: string;
  export default css;
}
