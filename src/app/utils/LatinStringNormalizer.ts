export class LatinStringNormalizer {

    public static search({ data, query }: { data: string, query: string }) {
        if (query == null || query == '') {
            return true;
        }
        if (data != null) {
            return LatinStringNormalizer.normalizeString(data).includes(LatinStringNormalizer.normalizeString(query));
        }
        return false;
    }

    public static normalizeString(string: string) {
        return string
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace('ª', 'a')
            .replace('º', 'o')
            .replace('°', 'o')
            .replace('¹', '1')
            .replace('²', '2')
            .replace('³', '3');
    }

}