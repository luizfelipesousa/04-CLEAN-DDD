export class Slug {
  public value: string

  constructor(value: string) {
    this.value = value
  }

  /**
   *
   * Should normalize an text to turn in a slug
   * Example: "An Random! text_" => "an-random-text"
   *
   * @param text: string
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKC')
      .replace(/\W+/g, '-')
      .replace(/_+/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')
      .toLowerCase()
      .trim()

    return new Slug(slugText)
  }
}
