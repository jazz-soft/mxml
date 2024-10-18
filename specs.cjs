const p2t = '<?xml version="1.0" encoding="UTF-8"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:output method="xml" indent="yes" encoding="UTF-8" omit-xml-declaration="no" standalone="no" doctype-system="http://www.musicxml.org/dtds/timewise.dtd" doctype-public="-//Recordare//DTD MusicXML 4.0 Timewise//EN"></xsl:output><xsl:template match="/"><xsl:apply-templates select="./score-partwise"></xsl:apply-templates><xsl:apply-templates select="./score-timewise"></xsl:apply-templates></xsl:template><xsl:template match="score-timewise"><xsl:copy-of select="."></xsl:copy-of></xsl:template><xsl:template match="text()"><xsl:value-of select="."></xsl:value-of></xsl:template><xsl:template match="*|@*|comment()|processing-instruction()"><xsl:copy><xsl:apply-templates select="*|@*|comment()|processing-instruction()|text()"></xsl:apply-templates></xsl:copy></xsl:template><xsl:template match="score-partwise"><xsl:element name="score-timewise"><xsl:apply-templates select="@version[.!=&apos;1.0&apos;]"></xsl:apply-templates><xsl:apply-templates select="work"></xsl:apply-templates><xsl:apply-templates select="movement-number"></xsl:apply-templates><xsl:apply-templates select="movement-title"></xsl:apply-templates><xsl:apply-templates select="identification"></xsl:apply-templates><xsl:apply-templates select="defaults"></xsl:apply-templates><xsl:apply-templates select="credit"></xsl:apply-templates><xsl:apply-templates select="part-list"></xsl:apply-templates><xsl:for-each select="part[1]/measure"><xsl:variable name="measure-number"><xsl:value-of select="@number"></xsl:value-of></xsl:variable><xsl:element name="measure"><xsl:attribute name="number"><xsl:value-of select="$measure-number"></xsl:value-of></xsl:attribute><xsl:if test="@text"><xsl:attribute name="text"><xsl:value-of select="@text"></xsl:value-of></xsl:attribute></xsl:if><xsl:if test="@implicit[. = &apos;yes&apos;]"><xsl:attribute name="implicit"><xsl:value-of select="@implicit"></xsl:value-of></xsl:attribute></xsl:if><xsl:if test="@non-controlling[. = &apos;yes&apos;]"><xsl:attribute name="non-controlling"><xsl:value-of select="@non-controlling"></xsl:value-of></xsl:attribute></xsl:if><xsl:if test="@width"><xsl:attribute name="width"><xsl:value-of select="@width"></xsl:value-of></xsl:attribute></xsl:if><xsl:for-each select="../../part/measure"><xsl:if test="@number=$measure-number"><xsl:element name="part"><xsl:attribute name="id"><xsl:value-of select="parent::part/@id"></xsl:value-of></xsl:attribute><xsl:apply-templates></xsl:apply-templates></xsl:element></xsl:if></xsl:for-each></xsl:element></xsl:for-each></xsl:element></xsl:template></xsl:stylesheet>';
const t2p = '<?xml version="1.0" encoding="UTF-8"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:output method="xml" indent="yes" encoding="UTF-8" omit-xml-declaration="no" standalone="no" doctype-system="http://www.musicxml.org/dtds/partwise.dtd" doctype-public="-//Recordare//DTD MusicXML 4.0 Partwise//EN"></xsl:output><xsl:template match="/"><xsl:apply-templates select="./score-partwise"></xsl:apply-templates><xsl:apply-templates select="./score-timewise"></xsl:apply-templates></xsl:template><xsl:template match="score-partwise"><xsl:copy-of select="."></xsl:copy-of></xsl:template><xsl:template match="text()"><xsl:value-of select="."></xsl:value-of></xsl:template><xsl:template match="*|@*|comment()|processing-instruction()"><xsl:copy><xsl:apply-templates select="*|@*|comment()|processing-instruction()|text()"></xsl:apply-templates></xsl:copy></xsl:template><xsl:template match="score-timewise"><xsl:element name="score-partwise"><xsl:apply-templates select="@version[.!=&apos;1.0&apos;]"></xsl:apply-templates><xsl:apply-templates select="work"></xsl:apply-templates><xsl:apply-templates select="movement-number"></xsl:apply-templates><xsl:apply-templates select="movement-title"></xsl:apply-templates><xsl:apply-templates select="identification"></xsl:apply-templates><xsl:apply-templates select="defaults"></xsl:apply-templates><xsl:apply-templates select="credit"></xsl:apply-templates><xsl:apply-templates select="part-list"></xsl:apply-templates><xsl:for-each select="measure[1]/part"><xsl:variable name="part-id"><xsl:value-of select="@id"></xsl:value-of></xsl:variable><xsl:element name="part"><xsl:copy-of select="@id"></xsl:copy-of><xsl:for-each select="../../measure/part"><xsl:if test="@id=$part-id"><xsl:element name="measure"><xsl:attribute name="number"><xsl:value-of select="parent::measure/@number"></xsl:value-of></xsl:attribute><xsl:if test="parent::measure/@text"><xsl:attribute name="text"><xsl:value-of select="parent::measure/@text"></xsl:value-of></xsl:attribute></xsl:if><xsl:if test="parent::measure/@implicit[. = &apos;yes&apos;]"><xsl:attribute name="implicit"><xsl:value-of select="parent::measure/@implicit"></xsl:value-of></xsl:attribute></xsl:if><xsl:if test="parent::measure/@non-controlling[. = &apos;yes&apos;]"><xsl:attribute name="non-controlling"><xsl:value-of select="parent::measure/@non-controlling"></xsl:value-of></xsl:attribute></xsl:if><xsl:if test="parent::measure/@width"><xsl:attribute name="width"><xsl:value-of select="parent::measure/@width"></xsl:value-of></xsl:attribute></xsl:if><xsl:apply-templates></xsl:apply-templates></xsl:element></xsl:if></xsl:for-each></xsl:element></xsl:for-each></xsl:element></xsl:template></xsl:stylesheet>';
module.exports = {
  p2t: p2t,
  t2p: t2p
};