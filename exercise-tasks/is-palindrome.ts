function isPalindrome(input: string): boolean {
  return input.toLowerCase() === input.toLowerCase().split('').reverse().join('');
}

const words: string[] = [
  "Madam",
  "mom",
  "Radar",
  "Levis",
  "Sony",
  "civic",
  "level",
  "radar",
  "noon",
  "tacocat",
  "Aibohphobia",
];

const result = words.map((word: string) => {
  return { [word]: isPalindrome(word) };
});

console.log(result);
